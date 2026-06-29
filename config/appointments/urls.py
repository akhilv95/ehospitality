from django.urls import path
from . import views

urlpatterns = [
    path('', views.AppointmentListView.as_view(), name='appointment-list'),
    path('create/', views.AppointmentCreateView.as_view(), name='appointment-create'),
    path('<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
    path('<int:pk>/cancel/', views.cancel_appointment, name='appointment-cancel'),
    path('<int:pk>/confirm/', views.confirm_appointment, name='appointment-confirm'),
    path('<int:pk>/complete/', views.complete_appointment, name='appointment-complete'),
]
