from django.urls import path
from . import views

urlpatterns = [
    path('', views.FacilityListView.as_view(), name='facility-list'),
    path('<int:pk>/', views.FacilityDetailView.as_view(), name='facility-detail'),
    path('admin/', views.FacilityAdminView.as_view(), name='facility-admin'),
    path('admin/<int:pk>/', views.FacilityAdminDetailView.as_view(), name='facility-admin-detail'),
    path('departments/', views.DepartmentListView.as_view(), name='department-list'),
    path('departments/admin/', views.DepartmentAdminView.as_view(), name='department-admin'),
    path('departments/admin/<int:pk>/', views.DepartmentAdminDetailView.as_view(), name='department-admin-detail'),
    path('resources/', views.ResourceListView.as_view(), name='resource-list'),
    path('resources/admin/', views.ResourceAdminView.as_view(), name='resource-admin'),
    path('resources/admin/<int:pk>/', views.ResourceAdminDetailView.as_view(), name='resource-admin-detail'),
]
