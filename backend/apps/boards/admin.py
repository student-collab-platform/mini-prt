from django.urls import path
from .views import (
    BoardListCreateView, BoardDetailView,
    ColumnListCreateView, ColumnDetailView,
    TaskListCreateView, TaskDetailView,
    CommentListCreateView,
    move_task, toggle_task
)
from django.contrib import admin
from .models import Board, Column, Task, Comment, Label

admin.site.register(Board)
admin.site.register(Column)
admin.site.register(Task)
admin.site.register(Comment)
admin.site.register(Label)
    
urlpatterns = [
    path('workspace/<int:workspace_id>/', BoardListCreateView.as_view()),
    path('<int:pk>/', BoardDetailView.as_view()),
    path('<int:board_id>/columns/', ColumnListCreateView.as_view()),
    path('columns/<int:pk>/', ColumnDetailView.as_view()),
    path('columns/<int:column_id>/tasks/', TaskListCreateView.as_view()),
    path('tasks/<int:pk>/', TaskDetailView.as_view()),
    path('tasks/<int:task_id>/move/', move_task),
    path('tasks/<int:task_id>/toggle/', toggle_task),
    path('tasks/<int:task_id>/comments/', CommentListCreateView.as_view()),
]