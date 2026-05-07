from rest_framework import serializers
from .models import Workspace, Membership
from apps.users.serializers import UserSerializer

class MembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'user', 'role', 'joined_at']

class WorkspaceSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members = MembershipSerializer(source='memberships', many=True, read_only=True)
    my_role = serializers.SerializerMethodField()

    class Meta:
        model = Workspace
        fields = ['id', 'name', 'description', 'created_by', 'members', 'my_role', 'created_at']

    def get_my_role(self, obj):
        request = self.context.get('request')
        if request:
            membership = obj.memberships.filter(user=request.user).first()
            return membership.role if membership else None
        return None

class InviteMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=['admin', 'member'], default='member')