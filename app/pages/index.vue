<template>
  <div class="min-h-screen bg-white">
    <!-- メインコンテンツ -->
    <main class="w-full">
      <!-- ヒーロー セクション -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <!-- 左側: テキスト -->
          <div class="order-2 lg:order-1">
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
            >
              ワクワクする最高の<br />スポーツライフを
            </h1>
            <p class="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              MatchMateはスポーツを楽しむすべてのチームにおくるチーム活動アプリです。<br />
              試合スケジュール管理から出欠確認、選手のポジション決定までワンストップで実現します。
            </p>
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <NuxtLink
                to="register"
                class="px-6 sm:px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition text-center text-sm sm:text-base"
              >
                無料で登録する
              </NuxtLink>
              <a
                href="#features"
                class="px-6 sm:px-8 py-3 border-2 border-green-500 text-green-500 font-semibold rounded-lg hover:bg-green-50 transition text-center text-sm sm:text-base"
              >
                詳しく見る
              </a>
            </div>
          </div>

          <!-- 右側: ビジュアル -->
          <div class="relative order-1 lg:order-2">
            <div
              class="rounded-lg sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl"
            >
              <!-- プレイヤー画像 -->
              <img
                src="@/assets/images/playerImage.webp"
                alt="サッカー選手"
                class="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 機能紹介セクション -->
      <section id="features" class="bg-gray-50 py-16 sm:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              主な機能
            </h2>
            <p class="text-lg text-gray-600">
              チーム運営に必要なすべての機能を完備
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- 機能1 -->
            <div
              class="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition"
            >
              <div class="text-4xl mb-4">👥</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">チーム管理</h3>
              <p class="text-gray-600">
                監督として複数チームを管理。選手の加入依頼承認もワンクリック。
              </p>
            </div>

            <!-- 機能2 -->
            <div
              class="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition"
            >
              <div class="text-4xl mb-4">📅</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                試合スケジュール
              </h3>
              <p class="text-gray-600">
                試合日程を作成・管理。選手の出欠確認も簡単に行えます。
              </p>
            </div>

            <!-- 機能3 -->
            <div
              class="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition"
            >
              <div class="text-4xl mb-4">✋</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">出欠管理</h3>
              <p class="text-gray-600">
                試合ごとに出欠を確認。参加可能な選手から効率的にメンバーを決定。
              </p>
            </div>

            <!-- 機能4 -->
            <div
              class="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition"
            >
              <div class="text-4xl mb-4">🎯</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                ポジション決定
              </h3>
              <p class="text-gray-600">
                出欠状況から最適なポジション配置をサポート。
              </p>
            </div>

            <!-- 機能5 -->
            <div
              class="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition"
            >
              <div class="text-4xl mb-4">📊</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">結果入力</h3>
              <p class="text-gray-600">
                試合結果を記録。チームの成績推移を管理できます。
              </p>
            </div>

            <!-- 機能6 -->
            <div
              class="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition"
            >
              <div class="text-4xl mb-4">📱</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                マルチデバイス
              </h3>
              <p class="text-gray-600">
                スマートフォン・パソコンどちらからでも利用可能。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ユーザータイプ紹介セクション -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            こんなあなたにぴったり
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- 監督向け -->
          <div
            class="border-2 border-green-200 rounded-lg p-8 bg-gradient-to-br from-green-50 to-transparent"
          >
            <div class="text-5xl mb-4">👨‍💼</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">チームの監督</h3>
            <ul class="space-y-3 text-gray-700">
              <li class="flex gap-2">
                <span class="text-green-500 font-bold">✓</span>
                <span>チーム管理を効率化したい</span>
              </li>
              <li class="flex gap-2">
                <span class="text-green-500 font-bold">✓</span>
                <span>出欠管理が大変</span>
              </li>
              <li class="flex gap-2">
                <span class="text-green-500 font-bold">✓</span>
                <span>選手のポジション配置に悩んでいる</span>
              </li>
              <li class="flex gap-2">
                <span class="text-green-500 font-bold">✓</span>
                <span>試合結果を記録したい</span>
              </li>
            </ul>
          </div>

          <!-- 選手向け -->
          <div
            class="border-2 border-blue-200 rounded-lg p-8 bg-gradient-to-br from-blue-50 to-transparent"
          >
            <div class="text-5xl mb-4">⚽</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">チームの選手</h3>
            <ul class="space-y-3 text-gray-700">
              <li class="flex gap-2">
                <span class="text-blue-500 font-bold">✓</span>
                <span>試合予定を忘れない</span>
              </li>
              <li class="flex gap-2">
                <span class="text-blue-500 font-bold">✓</span>
                <span>出欠を簡単に連絡したい</span>
              </li>
              <li class="flex gap-2">
                <span class="text-blue-500 font-bold">✓</span>
                <span>チーム情報をすぐに確認できる</span>
              </li>
              <li class="flex gap-2">
                <span class="text-blue-500 font-bold">✓</span>
                <span>他の選手の状況も見たい</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- CTA セクション -->
      <section
        class="bg-gradient-to-r from-green-500 to-green-600 py-16 sm:py-20"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
            今すぐ始めよう
          </h2>
          <p class="text-lg text-green-100 mb-8">
            MatchMateで、あなたのスポーツライフをもっと楽しく、効率的に
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="register"
              class="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition text-center"
            >
              無料で登録する
            </NuxtLink>
            <NuxtLink
              to="login"
              class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition text-center"
            >
              ログインする
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
// このページでは未ログイン時メニューを強制表示
definePageMeta({
  forceGuestMenu: true,
});
</script>
