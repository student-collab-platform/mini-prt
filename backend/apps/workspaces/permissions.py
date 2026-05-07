from rest_framework.permissions import BasePermission
from .models import Membership

class IsWorkspaceAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.memberships.filter(
            user=request.user, role='admin'
        ).exists()

class IsWorkspaceMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.memberships.filter(user=request.user).exists()