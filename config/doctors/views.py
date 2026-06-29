from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from datetime import datetime, timedelta
from accounts.permissions import IsAdmin, IsDoctor, IsDoctorOrAdmin
from .models import Doctor, DoctorSchedule, Specialization
from .serializers import (
    DoctorSerializer, DoctorCreateUpdateSerializer,
    DoctorScheduleSerializer, SpecializationSerializer
)
from.serializers import AdminDoctorCreateSerializer

class DoctorListView(generics.ListAPIView):
    queryset = Doctor.objects.select_related('user').prefetch_related('specializations', 'schedules').filter(is_available=True)
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['specializations', 'is_available']
    search_fields = ['user__first_name', 'user__last_name', 'specializations__name']


class DoctorDetailView(generics.RetrieveAPIView):
    queryset = Doctor.objects.select_related('user').prefetch_related('specializations', 'schedules')
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]


class DoctorProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsDoctor]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return DoctorCreateUpdateSerializer
        return DoctorSerializer

    
    def get_object(self):
        doctor, _ = Doctor.objects.get_or_create(
            user=self.request.user,
            defaults={'license_number': f'TEMP-{self.request.user.id}'}
        )
        return doctor


class DoctorScheduleListCreateView(generics.ListCreateAPIView):
    serializer_class = DoctorScheduleSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        return DoctorSchedule.objects.filter(doctor__user=self.request.user)

    def perform_create(self, serializer):
        doctor = Doctor.objects.get(user=self.request.user)
        serializer.save(doctor=doctor)


class DoctorScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DoctorScheduleSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        return DoctorSchedule.objects.filter(doctor__user=self.request.user)


class SpecializationListView(generics.ListAPIView):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [AllowAny]


class SpecializationAdminView(generics.ListCreateAPIView):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [IsAdmin]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_available_slots(request, doctor_id):
    """Get available appointment slots for a doctor on a specific date."""
    date_str = request.query_params.get('date')
    if not date_str:
        return Response({'error': 'Date parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
    
    day_of_week = date.weekday()
    print("=" * 50)
    print("Doctor ID:", doctor.id)
    print("Doctor:", doctor.user.get_full_name())
    print("Selected Date:", date)
    print("Weekday:", day_of_week)

    print("All schedules for this doctor:")
    for s in DoctorSchedule.objects.filter(doctor=doctor):
        print(
            s.day_of_week,
            s.get_day_of_week_display(),
            s.start_time,
            s.end_time,
            s.is_active
        )
    
    # schedules = DoctorSchedule.objects.filter(
    #     doctor=doctor,
    #     day_of_week=day_of_week,
    #     is_active=True
    # )
    
    # if not schedules.exists():
    #     return Response({'slots': [], 'message': 'No schedule available for this day'})
    
    # # Get existing appointments
    # from appointments.models import Appointment
    # existing_appointments = Appointment.objects.filter(
    #     doctor=doctor,
    #     date=date,
    #     status__in=['scheduled', 'confirmed']
    # ).values_list('time', flat=True)
    
    # booked_times = set(existing_appointments)
    # available_slots = []
    
    # for schedule in schedules:
    #     current_time = datetime.combine(date, schedule.start_time)
    #     end_time = datetime.combine(date, schedule.end_time)
        
    #     while current_time < end_time:
    #         slot_time = current_time.time()
    #         if slot_time not in booked_times:
    #             available_slots.append(slot_time.strftime('%H:%M'))
    #         current_time += timedelta(minutes=schedule.slot_duration)
    
    # return Response({'slots': available_slots, 'date': date_str})


    schedules = DoctorSchedule.objects.filter(
    doctor=doctor,
    day_of_week=day_of_week
)

    print("Schedules found:", schedules.count())

    for s in schedules:
            print(
        s.day_of_week,
        s.start_time,
        s.end_time,
        s.is_active
    )

    if not schedules.exists():
        return Response(
        {"slots": [], "message": "No schedule available for this day"}
    )

# Existing appointments
    from appointments.models import Appointment

    existing_appointments = Appointment.objects.filter(
    doctor=doctor,
    date=date,
    status__in=["scheduled", "confirmed"]
).values_list("time", flat=True)

    booked_times = set(existing_appointments)

    available_slots = []

    for schedule in schedules:
        current_time = datetime.combine(date, schedule.start_time)
        end_time = datetime.combine(date, schedule.end_time)

        while current_time < end_time:
            slot = current_time.time()

            if slot not in booked_times:
                available_slots.append(slot.strftime("%H:%M"))

            current_time += timedelta(minutes=schedule.slot_duration)

    return Response({
        "slots": available_slots,
        "date": date_str
    })
class AdminDoctorCreateView(generics.CreateAPIView):
    serializer_class = AdminDoctorCreateSerializer
    permission_classes = [IsAdmin]