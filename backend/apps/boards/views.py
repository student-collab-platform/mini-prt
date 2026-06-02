from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Board, Column, Task, Comment, Label, Activity
from .serializers import BoardSerializer, ColumnSerializer, TaskSerializer, CommentSerializer, LabelSerializer, ActivitySerializer
from apps.workspaces.models import Workspace


def is_workspace_member(user, workspace):
    return workspace.memberships.filter(user=user).exists()


def log_activity(user, workspace, action):
    Activity.objects.create(user=user, workspace=workspace, action=action)


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
        board = serializer.save(workspace=workspace)
        log_activity(self.request.user, workspace, f"created board '{board.name}'")


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


class ColumnDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ColumnSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Column.objects.filter(
            board__workspace__memberships__user=self.request.user
        )


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
        task = serializer.save(column=column)
        log_activity(
            self.request.user,
            column.board.workspace,
            f"created task '{task.title}'"
        )


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(
            column__board__workspace__memberships__user=self.request.user
        )


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(task_id=self.kwargs['task_id'])

    def perform_create(self, serializer):
        task = get_object_or_404(Task, id=self.kwargs['task_id'])
        serializer.save(task=task, author=self.request.user)


class LabelListCreateView(generics.ListCreateAPIView):
    serializer_class = LabelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Label.objects.filter(board_id=self.kwargs['board_id'])

    def perform_create(self, serializer):
        board = get_object_or_404(Board, id=self.kwargs['board_id'])
        serializer.save(board=board)


class LabelDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LabelSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Label.objects.all()


class ActivityListView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        workspace_id = self.kwargs['workspace_id']
        return Activity.objects.filter(
            workspace_id=workspace_id,
            workspace__memberships__user=self.request.user
        )[:50]


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
    log_activity(
        request.user,
        task.column.board.workspace,
        f"moved task '{task.title}' to '{column.name}'"
    )
    return Response(TaskSerializer(task).data)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def toggle_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.is_completed = not task.is_completed
    task.save()
    status_word = 'completed' if task.is_completed else 'reopened'
    log_activity(
        request.user,
        task.column.board.workspace,
        f"{status_word} task '{task.title}'"
    )
    return Response(TaskSerializer(task).data)