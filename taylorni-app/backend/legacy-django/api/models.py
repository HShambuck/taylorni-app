from django.db import models
from django.contrib.auth.models import User


class DesignerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='designer_profile')
    shop_name = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    rating = models.FloatField(default=0)


class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    preferences = models.JSONField(default=dict, blank=True)


class Product(models.Model):
    designer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    category = models.CharField(max_length=100, blank=True)
    images = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Order(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    designer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='designer_orders')
    status = models.CharField(max_length=50, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=10, default='USD')
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)


class PaymentMethod(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods')
    type = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    details = models.CharField(max_length=255)
    is_default = models.BooleanField(default=False)
    provider = models.CharField(max_length=50, blank=True)
    last_four = models.CharField(max_length=4, blank=True)
    expiry_date = models.CharField(max_length=10, blank=True)
    logo = models.CharField(max_length=255, blank=True)


class WalletBalance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    available = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pending = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=10, default='USD')


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    status = models.CharField(max_length=50, default='pending')
    description = models.CharField(max_length=255, blank=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=100)


class PaymentIntent(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payment_intents')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    status = models.CharField(max_length=50, default='pending')
    client_secret = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class EscrowPayment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='escrow_payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, default='held')
    release_conditions = models.JSONField(default=list, blank=True)
    held_until = models.DateTimeField(null=True, blank=True)


class Reward(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    points_cost = models.IntegerField()
    type = models.CharField(max_length=50)
    value = models.CharField(max_length=100)
    expires_at = models.DateTimeField(null=True, blank=True)
    image_url = models.CharField(max_length=255, blank=True)


class LoyaltyPoints(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='loyalty_points')
    total = models.IntegerField(default=0)
    available = models.IntegerField(default=0)
    pending = models.IntegerField(default=0)
    lifetime = models.IntegerField(default=0)


class PointsTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='points_transactions')
    type = models.CharField(max_length=50)
    points = models.IntegerField()
    description = models.CharField(max_length=255)
    related_order_id = models.CharField(max_length=100, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class ReferralData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referral_data')
    code = models.CharField(max_length=50)
    referrals = models.IntegerField(default=0)
    successful_referrals = models.IntegerField(default=0)
    total_earned = models.IntegerField(default=0)
    pending_rewards = models.IntegerField(default=0)


class ChatSession(models.Model):
    session_id = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    status = models.CharField(max_length=50, default='active')
    started_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Message(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    type = models.CharField(max_length=10)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    body = models.TextField()
    type = models.CharField(max_length=50, default='general')
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Measurement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='measurements')
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)


class TryOnSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tryon_sessions')
    garment_id = models.CharField(max_length=100)
    result_image = models.TextField(blank=True)
    confidence = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)


class TrackingEvent(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='tracking_events')
    status = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)
