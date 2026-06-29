from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdmin, IsPatient, IsDoctorOrAdmin
from .models import Invoice, Payment
from .serializers import (
    InvoiceSerializer, InvoiceCreateSerializer,
    PaymentSerializer, PaymentCreateSerializer
)


class InvoiceListView(generics.ListAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'patient']
    ordering_fields = ['created_at', 'due_date', 'total']

    def get_queryset(self):
        user = self.request.user
        queryset = Invoice.objects.select_related('patient__user').prefetch_related('items', 'payments')
        
        if user.is_patient:
            return queryset.filter(patient__user=user)
        elif user.is_admin:
            return queryset.all()
        return Invoice.objects.none()


class InvoiceCreateView(generics.CreateAPIView):
    serializer_class = InvoiceCreateSerializer
    permission_classes = [IsAdmin]


class InvoiceDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Invoice.objects.select_related('patient__user').prefetch_related('items', 'payments')
        
        if user.is_patient:
            return queryset.filter(patient__user=user)
        elif user.is_admin:
            return queryset.all()
        return Invoice.objects.none()


class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        invoice = serializer.validated_data['invoice']
        amount = serializer.validated_data['amount']
        
        if amount > invoice.balance_due:
            return Response(
                {'error': f'Payment amount exceeds balance due ({invoice.balance_due})'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_patient:
            return Payment.objects.filter(invoice__patient__user=user)
        elif user.is_admin:
            return Payment.objects.all()
        return Payment.objects.none()
