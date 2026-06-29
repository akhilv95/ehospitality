from django.urls import path
from . import views

urlpatterns = [
    path('', views.DoctorListView.as_view(), name='doctor-list'),
    path('<int:pk>/', views.DoctorDetailView.as_view(), name='doctor-detail'),
    path('<int:doctor_id>/available-slots/', views.get_available_slots, name='available-slots'),
    path('profile/', views.DoctorProfileView.as_view(), name='doctor-profile'),
    path('schedules/', views.DoctorScheduleListCreateView.as_view(), name='schedule-list'),
    path('schedules/<int:pk>/', views.DoctorScheduleDetailView.as_view(), name='schedule-detail'),
    path('specializations/', views.SpecializationListView.as_view(), name='specialization-list'),
    path('specializations/admin/', views.SpecializationAdminView.as_view(), name='specialization-admin'),
    path(
    "admin/create/",
    views.AdminDoctorCreateView.as_view(),
    name="admin-create-doctor",
),
]
