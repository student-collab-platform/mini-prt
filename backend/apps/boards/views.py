from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Board, Column, Task
from .serializers import BoardSerializer, ColumnSerializer, TaskSerializer
from apps.workspaces.models import Workspace

def is_workspace_member(user, workspace):
    return workspace.memberships.filter(user=user).exists()

def is_workspace_admin(user, workspace):
    return workspace.memberships.filter(user=user, role='admin').exists()

class BoardListCreateView(generics.ListCreateAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        workspace_id = self.kwargs['workspace_id']
        return Board.objects.filter(
            workspace_id=workspace_id,
            workspace__memberships__user=self.request.user
        )

    def perform_create(self, serializer):
        workspace = get_object_or_404(Workspace, id=self.kwargs['workspace_id'])
        if not is_workspace_member(self.request.user, workspace):
            raise PermissionError("Not a member of this workspace.")
        serializer.save(workspace=workspace)

class BoardDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(workspace__memberships__user=self.request.user)

class ColumnListCreateView(generics.ListCreateAPIView):
    serializer_class = ColumnSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Column.objects.filter(
            board_id=self.kwargs['board_id'],
            board__workspace__memberships__user=self.request.user
        )

    def perform_create(self, serializer):
        board = get_object_or_404(Board, id=self.kwargs['board_id'])
        serializer.save(board=board)

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(
            column_id=self.kwargs['column_id'],
            column__board__workspace__memberships__user=self.request.user
        )

    def perform_create(self, serializer):
        column = get_object_or_404(Column, id=self.kwargs['column_id'])
        serializer.save(column=column)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(
            column__board__workspace__memberships__user=self.request.user
        )

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def move_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    column_id = request.data.get('column_id')
    order = request.data.get('order', 0)
    
    column = get_object_or_404(Column, id=column_id)
    task.column = column
    task.order = order
    task.save()
    
    return Response(TaskSerializer(task).data)