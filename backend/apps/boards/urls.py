from django.urls import path
from .views import (
    BoardListCreateView, BoardDetailView,
    ColumnListCreateView, TaskListCreateView,
    TaskDetailView, move_task
)

urlpatterns = [
    path('workspace/<int:workspace_id>/', BoardListCreateView.as_view(), name='board-list'),
    path('<int:pk>/', BoardDetailView.as_view(), name='board-detail'),
    path('<int:board_id>/columns/', ColumnListCreateView.as_view(), name='column-list'),
    path('columns/<int:column_id>/tasks/', TaskListCreateView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('tasks/<int:task_id>/move/', move_task, name='move-task'),
]