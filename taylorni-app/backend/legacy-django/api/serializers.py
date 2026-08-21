from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    DesignerProfile, ClientProfile, Product, Order, OrderItem,
    PaymentMethod, WalletBalance, Transaction, PaymentIntent, EscrowPayment,
    Reward, LoyaltyPoints, PointsTransaction, ReferralData,
    ChatSession, Message, Notification, Measurement, TryOnSession, TrackingEvent
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class DesignerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = DesignerProfile
        fields = '__all__'


class ClientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ClientProfile
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'


class WalletBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletBalance
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class PaymentIntentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentIntent
        fields = '__all__'


class EscrowPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscrowPayment
        fields = '__all__'


class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'


class LoyaltyPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyPoints
        fields = '__all__'


class PointsTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointsTransaction
        fields = '__all__'


class ReferralDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralData
        fields = '__all__'


class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        fields = '__all__'


class TryOnSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TryOnSession
        fields = '__all__'


class TrackingEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackingEvent
        fields = '__all__'
