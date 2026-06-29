from django.urls import path
from . import views

urlpatterns = [
    path('', views.PatientListView.as_view(), name='patient-list'),
    path('<int:pk>/', views.PatientDetailView.as_view(), name='patient-detail'),
    path('profile/', views.PatientProfileView.as_view(), name='patient-profile'),
    path('allergies/', views.AllergyListCreateView.as_view(), name='allergy-list'),
    path('allergies/<int:pk>/', views.AllergyDetailView.as_view(), name='allergy-detail'),
    path('health-resources/', views.HealthEducationResourceListView.as_view(), name='health-resource-list'),
    path('health-resources/<int:pk>/', views.HealthEducationResourceDetailView.as_view(), name='health-resource-detail'),
    path('health-resources/admin/', views.HealthEducationResourceAdminView.as_view(), name='health-resource-admin'),
    path('health-resources/admin/<int:pk>/', views.HealthEducationResourceAdminDetailView.as_view(), name='health-resource-admin-detail'),
]
