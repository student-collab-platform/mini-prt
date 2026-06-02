from django.urls import path
from .views import (
    BoardListCreateView, BoardDetailView,
    ColumnListCreateView, ColumnDetailView,
    TaskListCreateView, TaskDetailView,
    CommentListCreateView, LabelListCreateView, LabelDetailView, ActivityListView,
    move_task, toggle_task
)

urlpatterns = [
    path('workspace/<int:workspace_id>/', BoardListCreateView.as_view()),
    path('<int:pk>/', BoardDetailView.as_view()),
    path('<int:board_id>/columns/', ColumnListCreateView.as_view()),
    path('<int:board_id>/labels/', LabelListCreateView.as_view()),
    path('columns/<int:pk>/', ColumnDetailView.as_view()),
    path('labels/<int:pk>/', LabelDetailView.as_view()),
    path('columns/<int:column_id>/tasks/', TaskListCreateView.as_view()),
    path('tasks/<int:pk>/', TaskDetailView.as_view()),
    path('tasks/<int:task_id>/move/', move_task),
    path('tasks/<int:task_id>/toggle/', toggle_task),
    path('tasks/<int:task_id>/comments/', CommentListCreateView.as_view()),
    path('activity/<int:workspace_id>/', ActivityListView.as_view()),
]
