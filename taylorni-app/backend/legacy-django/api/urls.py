from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('health', views.health),

    # Auth
    path('auth/register', views.RegisterView.as_view()),
    path('auth/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    # AI
    path('ai/chat', views.AIChatView.as_view()),
    path('ai/quick-actions', views.AIQuickActionsView.as_view()),
    path('ai/sessions/<str:session_id>/end', views.AISessionEndView.as_view()),

    # Rewards
    path('rewards/points/<str:user_id>', views.RewardsPointsView.as_view()),
    path('rewards/available/<str:user_id>', views.RewardsAvailableView.as_view()),
    path('rewards/redeem', views.RewardsRedeemView.as_view()),
    path('rewards/transactions/<str:user_id>', views.RewardsTransactionsView.as_view()),
    path('rewards/award', views.RewardsAwardView.as_view()),
    path('rewards/referrals/<str:user_id>', views.RewardsReferralView.as_view()),
    path('rewards/referrals/generate', views.RewardsReferralGenerateView.as_view()),
    path('rewards/referrals/apply', views.RewardsReferralApplyView.as_view()),

    # Payments & Wallet
    path('payments/intents', views.PaymentIntentView.as_view()),
    path('payments/card/process', views.CardPaymentView.as_view()),
    path('payments/mobile-money/process', views.MobileMoneyProcessView.as_view()),
    path('payments/mobile-money/verify/<str:reference>', views.MobileMoneyVerifyView.as_view()),
    path('wallet/<str:user_id>/balance', views.WalletBalanceView.as_view()),
    path('payments/wallet/process', views.WalletProcessView.as_view()),
    path('wallet/<str:user_id>/add-funds', views.WalletAddFundsView.as_view()),
    path('wallet/<str:user_id>/withdraw', views.WalletWithdrawView.as_view()),
    path('payments/escrow/create', views.EscrowCreateView.as_view()),
    path('payments/escrow/<str:escrow_id>/release', views.EscrowReleaseView.as_view()),
    path('payments/transactions/<str:user_id>', views.TransactionHistoryView.as_view()),
    path('payments/methods/<str:user_id>', views.PaymentMethodsView.as_view()),
    path('payments/methods/<str:user_id>/<str:method_id>', views.PaymentMethodDetailView.as_view()),
    path('payments/methods/<str:user_id>/<str:method_id>/default', views.PaymentMethodDefaultView.as_view()),
]
