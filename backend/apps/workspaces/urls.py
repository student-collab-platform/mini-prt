from django.urls import path
from .views import WorkspaceListCreateView, WorkspaceDetailView, invite_member, remove_member

urlpatterns = [
    path('', WorkspaceListCreateView.as_view(), name='workspace-list'),
    path('<int:pk>/', WorkspaceDetailView.as_view(), name='workspace-detail'),
    path('<int:workspace_id>/invite/', invite_member, name='invite-member'),
    path('<int:workspace_id>/members/<int:user_id>/', remove_member, name='remove-member'),
]