from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    DesignerProfile, ClientProfile, Product, Order, OrderItem,
    PaymentMethod, WalletBalance, Transaction, PaymentIntent, EscrowPayment,
    Reward, LoyaltyPoints, PointsTransaction, ReferralData,
    ChatSession, Message, Notification, Measurement, TryOnSession, TrackingEvent
)
from .serializers import (
    ProductSerializer, OrderSerializer, PaymentMethodSerializer,
    WalletBalanceSerializer, TransactionSerializer, PaymentIntentSerializer,
    EscrowPaymentSerializer, RewardSerializer, LoyaltyPointsSerializer,
    PointsTransactionSerializer, ReferralDataSerializer, MessageSerializer
)


def get_or_create_user(user_identifier):
    if not user_identifier:
        username = "anonymous"
        user, _ = User.objects.get_or_create(username=username, defaults={"email": "anonymous@example.com"})
        return user

    if isinstance(user_identifier, int) or (isinstance(user_identifier, str) and user_identifier.isdigit()):
        user_id = int(user_identifier)
        user, _ = User.objects.get_or_create(id=user_id, defaults={
            "username": f"user_{user_id}",
            "email": f"user_{user_id}@example.com",
        })
        return user

    username = f"user_{user_identifier}"
    user, _ = User.objects.get_or_create(username=username, defaults={"email": f"{username}@example.com"})
    return user


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get("email")
        password = data.get("password")
        first_name = data.get("firstName", "")
        last_name = data.get("lastName", "")
        user_type = data.get("userType", "client")

        if not email or not password:
            return Response({"error": "email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({"error": "user exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        if user_type == "designer":
            DesignerProfile.objects.create(user=user, shop_name=data.get("shopName", ""))
        else:
            ClientProfile.objects.create(user=user)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "userType": user_type,
            "userId": user.id,
        })


class AIChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        session_id = request.data.get("sessionId")
        message_text = request.data.get("message", "")
        user_id = request.data.get("userId")

        user = get_or_create_user(user_id)
        session, _ = ChatSession.objects.get_or_create(session_id=session_id, defaults={"user": user})

        Message.objects.create(
            session=session,
            type="user",
            content=message_text,
            metadata={"intent": request.data.get("intent", "general_inquiry")},
        )

        bot_response = {
            "messageId": f"bot_{int(timezone.now().timestamp())}",
            "response": "Thanks for your message! I can help with orders, designers, and style advice.",
            "intent": request.data.get("intent", "general_inquiry"),
            "confidence": 0.9,
            "suggestions": ["Track my order", "Find a designer", "Get style advice"],
        }

        Message.objects.create(
            session=session,
            type="bot",
            content=bot_response["response"],
            metadata={
                "intent": bot_response["intent"],
                "confidence": bot_response["confidence"],
                "suggestions": bot_response["suggestions"],
            },
        )

        session.status = "active"
        session.save(update_fields=["status", "updated_at"])

        return Response(bot_response)


class AIQuickActionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"actions": [
            "Track my order",
            "Find a designer",
            "Get style advice",
            "Contact support",
        ]})


class AISessionEndView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, session_id):
        ChatSession.objects.filter(session_id=session_id).update(status="resolved")
        return Response({"status": "ended"})


class RewardsPointsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        user = get_or_create_user(user_id)
        points, _ = LoyaltyPoints.objects.get_or_create(user=user)
        return Response(LoyaltyPointsSerializer(points).data)


class RewardsAvailableView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        rewards = Reward.objects.all()
        if not rewards.exists():
            Reward.objects.create(title="$5 Off Next Order", description="Get $5 off", points_cost=100, type="discount", value="$5")
            Reward.objects.create(title="Free Shipping", description="Free shipping", points_cost=150, type="freebie", value="Free Shipping")
            rewards = Reward.objects.all()
        return Response(RewardSerializer(rewards, many=True).data)


class RewardsRedeemView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({"status": "redeemed"})


class RewardsTransactionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        user = get_or_create_user(user_id)
        tx = PointsTransaction.objects.filter(user=user)
        return Response(PointsTransactionSerializer(tx, many=True).data)


class RewardsAwardView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_or_create_user(request.data.get("userId"))
        points = int(request.data.get("points", 0))
        LoyaltyPoints.objects.get_or_create(user=user)
        PointsTransaction.objects.create(
            user=user,
            type="earned",
            points=points,
            description=f"Awarded points for {request.data.get('action', 'action')}",
        )
        return Response({"pointsAwarded": points})


class RewardsReferralView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        user = get_or_create_user(user_id)
        referral, _ = ReferralData.objects.get_or_create(user=user, defaults={"code": f"REF{user.id}"})
        return Response(ReferralDataSerializer(referral).data)


class RewardsReferralGenerateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = get_or_create_user(request.data.get("userId"))
        referral, _ = ReferralData.objects.get_or_create(user=user, defaults={"code": f"REF{user.id}"})
        return Response({"code": referral.code})


class RewardsReferralApplyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({"status": "applied"})


class PaymentIntentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        order_id = request.data.get("orderId", "0")
        amount = request.data.get("amount", 0)
        currency = request.data.get("currency", "USD")
        user = get_or_create_user(request.data.get("userId"))
        order, _ = Order.objects.get_or_create(id=int(order_id), defaults={"client": user})
        intent = PaymentIntent.objects.create(order=order, amount=amount, currency=currency, status="pending")
        return Response(PaymentIntentSerializer(intent).data)


class CardPaymentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({"success": True})


class MobileMoneyProcessView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({"reference": "MM_REF_123", "authorization_url": ""})


class MobileMoneyVerifyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, reference):
        return Response({
            "id": reference,
            "type": "debit",
            "amount": 0,
            "currency": "USD",
            "status": "completed",
            "description": "Mobile money payment",
            "reference": reference,
        })


class WalletBalanceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        user = get_or_create_user(user_id)
        wallet, _ = WalletBalance.objects.get_or_create(user=user)
        return Response(WalletBalanceSerializer(wallet).data)


class WalletProcessView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({"success": True})


class WalletAddFundsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, user_id):
        return Response({"status": "added"})


class WalletWithdrawView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, user_id):
        return Response({"status": "withdrawn"})


class EscrowCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({"status": "created"})


class EscrowReleaseView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, escrow_id):
        return Response({"status": "released"})


class TransactionHistoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        user = get_or_create_user(user_id)
        tx = Transaction.objects.filter(user=user)
        return Response(TransactionSerializer(tx, many=True).data)


class PaymentMethodsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        user = get_or_create_user(user_id)
        methods = PaymentMethod.objects.filter(user=user)
        return Response(PaymentMethodSerializer(methods, many=True).data)

    def post(self, request, user_id):
        user = get_or_create_user(user_id)
        data = request.data
        method = PaymentMethod.objects.create(
            user=user,
            type=data.get("type", "card"),
            name=data.get("name", "Card"),
            details=data.get("details", ""),
            is_default=data.get("isDefault", False),
        )
        return Response(PaymentMethodSerializer(method).data)


class PaymentMethodDetailView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, user_id, method_id):
        PaymentMethod.objects.filter(id=method_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PaymentMethodDefaultView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, user_id, method_id):
        PaymentMethod.objects.filter(user__id=user_id).update(is_default=False)
        PaymentMethod.objects.filter(id=method_id).update(is_default=True)
        return Response({"status": "ok"})


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})
