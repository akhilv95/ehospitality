from django.urls import path
from . import views

urlpatterns = [
    path('', views.PrescriptionListView.as_view(), name='prescription-list'),
    path('create/', views.PrescriptionCreateView.as_view(), name='prescription-create'),
    path('<int:pk>/', views.PrescriptionDetailView.as_view(), name='prescription-detail'),
    path('<int:pk>/send-to-pharmacy/', views.send_to_pharmacy, name='send-to-pharmacy'),
    path('check-interactions/', views.check_drug_interactions, name='check-interactions'),
]
