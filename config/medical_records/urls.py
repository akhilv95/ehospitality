from django.urls import path
from . import views

urlpatterns = [
    path('', views.MedicalRecordListView.as_view(), name='medical-record-list'),
    path('create/', views.MedicalRecordCreateView.as_view(), name='medical-record-create'),
    path('<int:pk>/', views.MedicalRecordDetailView.as_view(), name='medical-record-detail'),
    path('patient/<int:patient_id>/history/', views.PatientMedicalHistoryView.as_view(), name='patient-history'),
    path('lab-results/', views.LabResultCreateView.as_view(), name='lab-result-create'),
    path('lab-results/<int:pk>/', views.LabResultDetailView.as_view(), name='lab-result-detail'),
]
