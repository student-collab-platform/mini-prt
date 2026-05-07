from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Workspace, Membership
from .serializers import WorkspaceSerializer, InviteMemberSerializer, MembershipSerializer
from apps.users.models import User

class WorkspaceListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Workspace.objects.filter(memberships__user=self.request.user)

    def perform_create(self, serializer):
        workspace = serializer.save(created_by=self.request.user)
        Membership.objects.create(
            user=self.request.user,
            workspace=workspace,
            role='admin'
        )

class WorkspaceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Workspace.objects.filter(memberships__user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def invite_member(request, workspace_id):
    workspace = get_object_or_404(Workspace, id=workspace_id)
    
    # only admins can invite
    if not workspace.memberships.filter(user=request.user, role='admin').exists():
        return Response({'error': 'Only admins can invite members.'}, status=403)

    serializer = InviteMemberSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        role = serializer.validated_data['role']
        user = get_object_or_404(User, email=email)
        
        membership, created = Membership.objects.get_or_create(
            user=user, workspace=workspace,
            defaults={'role': role}
        )
        if not created:
            return Response({'error': 'User is already a member.'}, status=400)
        
        return Response(MembershipSerializer(membership).data, status=201)
    
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_member(request, workspace_id, user_id):
    workspace = get_object_or_404(Workspace, id=workspace_id)
    
    if not workspace.memberships.filter(user=request.user, role='admin').exists():
        return Response({'error': 'Only admins can remove members.'}, status=403)
    
    membership = get_object_or_404(Membership, workspace=workspace, user_id=user_id)
    membership.delete()
    return Response(status=204)