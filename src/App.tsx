import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  Bell,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  Download,
  FileCheck2,
  FileText,
  Filter,
  Home,
  Landmark,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Receipt,
  Search,
  Send,
  Settings,
  Sun,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  AppShell,
  Badge,
  BrandMark,
  CardSurface,
  GhostButton,
  IconButton,
  MobileDrawer,
  Overlay,
  PanelSurface,
  PrimaryButton,
  ProgressBar,
  RowButton,
  SearchInput,
  SecondaryButton,
  SidebarHeader,
  SidebarShell,
  TabButton,
  WorkspaceFrame,
  WorkspaceHeader,
} from './components/ui';

type Language = 'ja' | 'en';
type ThemeMode = 'light' | 'dark' | 'system';
type TabId = 'overview' | 'clients' | 'projects' | 'invoices' | 'reports';
type SidebarId = TabId | 'tasks' | 'settings';
type PanelPresentation = 'inspector' | 'modal';
type Tone = 'neutral' | 'emerald' | 'amber' | 'rose' | 'stone';
type ClientFilter = 'all' | 'unanswered' | 'highValue' | 'recent';
type ProjectFilter = 'all' | 'onTrack' | 'atRisk' | 'delayed';
type InvoiceFilter = 'all' | 'quote' | 'draft' | 'sent' | 'waiting' | 'overdue' | 'paid';
type ReportRange = 'month' | 'quarter' | 'year';

type InspectorPanel = {
  eyebrow: string;
  title: string;
  body: string;
  icon?: LucideIcon;
  tone?: Tone;
  meta: Array<{ label: string; value: string }>;
  progress?: number;
  progressLabel?: string;
  presentation?: PanelPresentation;
  primaryLabel: string;
  secondaryLabel: string;
};

type NoticeState = {
  id: number;
  title: string;
  body?: string;
};

type OpenPanelHandler = (panel: InspectorPanel, noticeTitle?: string, noticeBody?: string, presentation?: PanelPresentation) => void;
type ShowNoticeHandler = (title: string, body?: string) => void;

const TEMPLATE_ID = 'official-dashboard-client-billing';
const THEME_STORAGE_KEY = 'melius-official-dashboard-client-billing-theme';
const LANGUAGE_STORAGE_KEY = 'melius-official-dashboard-client-billing-language';

const COPY = {
  en: {
    metaTitle: 'Ledger Desk Client Billing Dashboard',
    appName: 'Ledger Desk',
    appSubtitle: 'Client Billing',
    search: 'Search clients, projects, invoices...',
    searchLabel: 'Search billing workspace',
    openSidebar: 'Open navigation',
    closeSidebar: 'Close navigation',
    collapseSidebar: 'Toggle sidebar',
    notifications: 'Notifications',
    messages: 'Messages',
    collectPayment: 'Collect payment',
    newInvoice: 'New invoice',
    exportReport: 'Export report',
    userName: 'Ops Lead',
    plan: 'Studio',
    theme: {
      label: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    language: {
      label: 'Language',
      ja: 'JA',
      en: 'EN',
    },
    tabs: {
      overview: 'Overview',
      clients: 'Clients',
      projects: 'Projects',
      invoices: 'Invoices',
      reports: 'Reports',
    },
    sidebar: {
      overview: { title: 'Overview' },
      clients: { title: 'Clients', badge: '3', children: ['All clients', 'Unanswered', 'High forecast', 'Recent contacts'] },
      projects: { title: 'Projects', badge: '5', children: ['Active projects', 'At risk', 'Due this month', 'Margin review'] },
      invoices: { title: 'Invoices', badge: '7', children: ['Quotes', 'Drafts', 'Waiting payment', 'Overdue'] },
      reports: { title: 'Reports', children: ['Monthly sales', 'Project margin', 'Utilization', 'Collection status'] },
      tasks: { title: 'Tasks', children: ['This week', 'Approvals', 'Follow-ups'] },
      settings: { title: 'Settings', children: ['Team roles', 'Tax settings', 'Reminder rules'] },
    },
    overview: {
      title: 'Operations overview',
      body: 'Revenue, project risk, invoice recovery, and weekly tasks for a small client-service team.',
      updated: 'Updated today 09:20',
      primary: 'Prepare invoices',
      secondary: 'Review late items',
    },
    sections: {
      kpis: 'Selected KPIs',
      taskQueue: 'This week tasks',
      paymentTimeline: 'Payment timeline',
      clientPipeline: 'Client pipeline',
      clientTable: 'Client list',
      projectBoard: 'Project progress',
      projectMargin: 'Margin watch',
      invoiceList: 'Invoice desk',
      collectionQueue: 'Collection queue',
      revenueReport: 'Monthly revenue',
      marginReport: 'Project margin',
      utilizationReport: 'Utilization',
      recoveryReport: 'Collection status',
    },
    actions: {
      viewAll: 'View all',
      open: 'Open',
      contact: 'Contact',
      remind: 'Remind',
      markPaid: 'Mark paid',
      send: 'Send',
      duplicate: 'Duplicate',
      approve: 'Approve',
      filter: 'Filter',
      sort: 'Sort',
      complete: 'Complete',
      reopen: 'Reopen',
      inspect: 'Inspect',
    },
    filters: {
      all: 'All',
      unanswered: 'Unanswered',
      highValue: 'High forecast',
      recent: 'Recent contact',
      onTrack: 'On track',
      atRisk: 'At risk',
      delayed: 'Delayed',
      quote: 'Quote',
      draft: 'Draft',
      sent: 'Sent',
      waiting: 'Waiting',
      overdue: 'Overdue',
      paid: 'Paid',
      month: 'Month',
      quarter: 'Quarter',
      year: 'Year',
    },
    labels: {
      revenue: 'Revenue',
      scheduled: 'Scheduled',
      uninvoiced: 'Uninvoiced',
      delayed: 'Delayed',
      tasks: 'Tasks',
      client: 'Client',
      project: 'Project',
      owner: 'Owner',
      lastContact: 'Last contact',
      unanswered: 'Unanswered',
      forecast: 'Forecast',
      due: 'Due',
      progress: 'Progress',
      margin: 'Margin',
      status: 'Status',
      amount: 'Amount',
      issued: 'Issued',
      paymentDue: 'Payment due',
      workload: 'Workload',
      collection: 'Collection',
    },
    status: {
      onTrack: 'On track',
      atRisk: 'At risk',
      delayed: 'Delayed',
      ready: 'Ready',
      quote: 'Quote',
      draft: 'Draft',
      sent: 'Sent',
      waiting: 'Waiting',
      overdue: 'Overdue',
      paid: 'Paid',
      unanswered: 'Unanswered',
      active: 'Active',
    },
  },
  ja: {
    metaTitle: 'Ledger Desk 案件・請求ダッシュボード',
    appName: 'Ledger Desk',
    appSubtitle: '案件・請求管理',
    search: '顧客、案件、請求を検索...',
    searchLabel: '案件・請求ワークスペースを検索',
    openSidebar: 'ナビゲーションを開く',
    closeSidebar: 'ナビゲーションを閉じる',
    collapseSidebar: 'サイドバーを切り替え',
    notifications: '通知',
    messages: 'メッセージ',
    collectPayment: '入金確認',
    newInvoice: '請求書作成',
    exportReport: 'レポート出力',
    userName: '業務責任者',
    plan: 'Studio',
    theme: {
      label: '表示テーマ',
      light: 'ライト',
      dark: 'ダーク',
      system: '自動',
    },
    language: {
      label: '言語',
      ja: 'JA',
      en: 'EN',
    },
    tabs: {
      overview: '概要',
      clients: '顧客',
      projects: '案件',
      invoices: '請求',
      reports: 'レポート',
    },
    sidebar: {
      overview: { title: '概要' },
      clients: { title: '顧客', badge: '3', children: ['すべての顧客', '未対応', '高見込み', '最近連絡'] },
      projects: { title: '案件', badge: '5', children: ['進行中案件', '注意案件', '今月納期', '粗利確認'] },
      invoices: { title: '請求', badge: '7', children: ['見積', '下書き', '入金待ち', '期限超過'] },
      reports: { title: 'レポート', children: ['月次売上', '案件別粗利', '稼働', '回収状況'] },
      tasks: { title: 'タスク', children: ['今週', '承認待ち', 'フォローアップ'] },
      settings: { title: '設定', children: ['チーム権限', '税設定', '督促ルール'] },
    },
    overview: {
      title: '業務オーバービュー',
      body: '小規模チームの売上、案件リスク、請求回収、今週のタスクを一画面で確認します。',
      updated: '本日 09:20 更新',
      primary: '請求準備',
      secondary: '遅延確認',
    },
    sections: {
      kpis: '主要KPI',
      taskQueue: '今週のタスク',
      paymentTimeline: '入金予定',
      clientPipeline: '顧客パイプライン',
      clientTable: '顧客一覧',
      projectBoard: '案件進行',
      projectMargin: '粗利確認',
      invoiceList: '請求デスク',
      collectionQueue: '回収キュー',
      revenueReport: '月次売上',
      marginReport: '案件別粗利',
      utilizationReport: '稼働状況',
      recoveryReport: '請求回収状況',
    },
    actions: {
      viewAll: 'すべて見る',
      open: '開く',
      contact: '連絡',
      remind: '督促',
      markPaid: '入金済みにする',
      send: '送信',
      duplicate: '複製',
      approve: '承認',
      filter: '絞り込み',
      sort: '並び替え',
      complete: '完了',
      reopen: '戻す',
      inspect: '確認',
    },
    filters: {
      all: 'すべて',
      unanswered: '未対応',
      highValue: '高見込み',
      recent: '最近連絡',
      onTrack: '順調',
      atRisk: '注意',
      delayed: '遅延',
      quote: '見積',
      draft: '下書き',
      sent: '送付済み',
      waiting: '入金待ち',
      overdue: '期限超過',
      paid: '入金済み',
      month: '月次',
      quarter: '四半期',
      year: '年次',
    },
    labels: {
      revenue: '売上',
      scheduled: '入金予定',
      uninvoiced: '未請求',
      delayed: '遅延',
      tasks: 'タスク',
      client: '顧客',
      project: '案件',
      owner: '担当',
      lastContact: '最終連絡',
      unanswered: '未対応',
      forecast: '見込み',
      due: '納期',
      progress: '進捗',
      margin: '粗利',
      status: '状態',
      amount: '金額',
      issued: '発行',
      paymentDue: '支払期限',
      workload: '稼働',
      collection: '回収',
    },
    status: {
      onTrack: '順調',
      atRisk: '注意',
      delayed: '遅延',
      ready: '準備完了',
      quote: '見積',
      draft: '下書き',
      sent: '送付済み',
      waiting: '入金待ち',
      overdue: '期限超過',
      paid: '入金済み',
      unanswered: '未対応',
      active: '進行中',
    },
  },
} as const;

type AppCopy = (typeof COPY)[Language];
type StatusKey = keyof typeof COPY.en.status;

const tabs: TabId[] = ['overview', 'clients', 'projects', 'invoices', 'reports'];

const sidebarItems: Array<{
  id: SidebarId;
  icon: LucideIcon;
  hasChildren?: boolean;
}> = [
  { id: 'overview', icon: Home },
  { id: 'clients', icon: Users, hasChildren: true },
  { id: 'projects', icon: Briefcase, hasChildren: true },
  { id: 'invoices', icon: Receipt, hasChildren: true },
  { id: 'reports', icon: BarChart3, hasChildren: true },
  { id: 'tasks', icon: ClipboardList, hasChildren: true },
  { id: 'settings', icon: Settings, hasChildren: true },
];

const summaryMetrics: Array<{
  id: string;
  icon: LucideIcon;
  tone: Tone;
  label: Record<Language, string>;
  value: string;
  detail: Record<Language, string>;
}> = [
  {
    id: 'monthly-revenue',
    icon: Wallet,
    tone: 'emerald',
    label: { en: 'Revenue this month', ja: '今月売上' },
    value: '¥4.82M',
    detail: { en: '+18% vs last month', ja: '前月比 +18%' },
  },
  {
    id: 'scheduled-payments',
    icon: CalendarDays,
    tone: 'stone',
    label: { en: 'Scheduled payments', ja: '入金予定' },
    value: '¥2.15M',
    detail: { en: '7 items in 14 days', ja: '14日以内に7件' },
  },
  {
    id: 'uninvoiced-work',
    icon: FileCheck2,
    tone: 'amber',
    label: { en: 'Uninvoiced work', ja: '未請求' },
    value: '¥890K',
    detail: { en: '3 ready for billing', ja: '請求可能な案件3件' },
  },
  {
    id: 'delayed-projects',
    icon: AlertTriangle,
    tone: 'rose',
    label: { en: 'Delayed projects', ja: '遅延案件' },
    value: '2',
    detail: { en: '1 invoice blocked', ja: '請求停止中1件' },
  },
  {
    id: 'weekly-tasks',
    icon: ClipboardList,
    tone: 'neutral',
    label: { en: 'Tasks this week', ja: '今週のタスク' },
    value: '12',
    detail: { en: '5 due today', ja: '本日期限5件' },
  },
];

const clients = [
  {
    id: 'luma-craft',
    name: 'Luma Craft Co.',
    segment: { en: 'Brand studio retainer', ja: 'ブランド運用契約' },
    lastContact: { en: 'May 19', ja: '5月19日' },
    unattended: 2,
    forecast: '¥1.62M',
    owner: { en: 'Account lead', ja: 'アカウント担当' },
    status: 'unanswered' as StatusKey,
    valueRank: 5,
    notes: { en: 'Estimate approval is waiting on scope confirmation.', ja: '見積承認はスコープ確認待ちです。' },
  },
  {
    id: 'harbor-loom',
    name: 'Harbor & Loom',
    segment: { en: 'Commerce renewal', ja: 'コマース刷新' },
    lastContact: { en: 'May 20', ja: '5月20日' },
    unattended: 0,
    forecast: '¥980K',
    owner: { en: 'Producer desk', ja: '制作進行' },
    status: 'active' as StatusKey,
    valueRank: 3,
    notes: { en: 'Next review is booked after the prototype handoff.', ja: 'プロトタイプ引き継ぎ後に次回レビュー予定です。' },
  },
  {
    id: 'northline-office',
    name: 'Northline Office',
    segment: { en: 'Internal tool build', ja: '社内ツール開発' },
    lastContact: { en: 'May 16', ja: '5月16日' },
    unattended: 1,
    forecast: '¥2.08M',
    owner: { en: 'Delivery lead', ja: '納品責任者' },
    status: 'unanswered' as StatusKey,
    valueRank: 5,
    notes: { en: 'Contract update and tax line review need confirmation.', ja: '契約更新と税区分の確認が必要です。' },
  },
  {
    id: 'koma-supply',
    name: 'Koma Supply Works',
    segment: { en: 'Consulting sprint', ja: 'コンサルスプリント' },
    lastContact: { en: 'May 21', ja: '5月21日' },
    unattended: 0,
    forecast: '¥540K',
    owner: { en: 'Consulting lead', ja: 'コンサル担当' },
    status: 'active' as StatusKey,
    valueRank: 2,
    notes: { en: 'Discovery invoice can be issued after the workshop notes are approved.', ja: 'ワークショップ記録承認後に初期請求できます。' },
  },
  {
    id: 'bridgefield',
    name: 'Bridgefield Labs',
    segment: { en: 'Product design support', ja: 'プロダクト設計支援' },
    lastContact: { en: 'May 14', ja: '5月14日' },
    unattended: 3,
    forecast: '¥1.34M',
    owner: { en: 'Ops desk', ja: '業務窓口' },
    status: 'unanswered' as StatusKey,
    valueRank: 4,
    notes: { en: 'Two change requests need a revised quote.', ja: '変更依頼2件に改訂見積が必要です。' },
  },
];

const projects = [
  {
    id: 'commerce-renewal',
    name: { en: 'Commerce renewal', ja: 'コマース刷新' },
    clientId: 'harbor-loom',
    due: { en: 'Jun 05', ja: '6月5日' },
    progress: 72,
    owner: { en: 'Producer desk', ja: '制作進行' },
    margin: '31%',
    status: 'onTrack' as StatusKey,
    amount: '¥1.18M',
  },
  {
    id: 'billing-portal',
    name: { en: 'Billing portal build', ja: '請求ポータル構築' },
    clientId: 'northline-office',
    due: { en: 'Jun 14', ja: '6月14日' },
    progress: 54,
    owner: { en: 'Delivery lead', ja: '納品責任者' },
    margin: '24%',
    status: 'atRisk' as StatusKey,
    amount: '¥2.08M',
  },
  {
    id: 'brand-retainer',
    name: { en: 'Monthly brand retainer', ja: '月次ブランド運用' },
    clientId: 'luma-craft',
    due: { en: 'May 28', ja: '5月28日' },
    progress: 88,
    owner: { en: 'Account lead', ja: 'アカウント担当' },
    margin: '42%',
    status: 'onTrack' as StatusKey,
    amount: '¥740K',
  },
  {
    id: 'sprint-audit',
    name: { en: 'Operations audit sprint', ja: '業務監査スプリント' },
    clientId: 'koma-supply',
    due: { en: 'May 24', ja: '5月24日' },
    progress: 64,
    owner: { en: 'Consulting lead', ja: 'コンサル担当' },
    margin: '37%',
    status: 'onTrack' as StatusKey,
    amount: '¥540K',
  },
  {
    id: 'product-design',
    name: { en: 'Product design support', ja: 'プロダクト設計支援' },
    clientId: 'bridgefield',
    due: { en: 'May 23', ja: '5月23日' },
    progress: 46,
    owner: { en: 'Ops desk', ja: '業務窓口' },
    margin: '18%',
    status: 'delayed' as StatusKey,
    amount: '¥1.34M',
  },
];

const invoices = [
  {
    id: 'inv-2048',
    title: { en: 'Commerce milestone 2', ja: 'コマース刷新 第2マイルストーン' },
    clientId: 'harbor-loom',
    projectId: 'commerce-renewal',
    status: 'waiting' as InvoiceFilter,
    amount: '¥620K',
    issued: { en: 'May 10', ja: '5月10日' },
    due: { en: 'May 25', ja: '5月25日' },
  },
  {
    id: 'inv-2049',
    title: { en: 'Billing portal kickoff', ja: '請求ポータル着手金' },
    clientId: 'northline-office',
    projectId: 'billing-portal',
    status: 'sent' as InvoiceFilter,
    amount: '¥780K',
    issued: { en: 'May 18', ja: '5月18日' },
    due: { en: 'Jun 01', ja: '6月1日' },
  },
  {
    id: 'inv-2050',
    title: { en: 'Brand retainer May', ja: '5月ブランド運用' },
    clientId: 'luma-craft',
    projectId: 'brand-retainer',
    status: 'draft' as InvoiceFilter,
    amount: '¥420K',
    issued: { en: 'Draft', ja: '下書き' },
    due: { en: 'May 31', ja: '5月31日' },
  },
  {
    id: 'est-114',
    title: { en: 'Change request estimate', ja: '変更依頼見積' },
    clientId: 'bridgefield',
    projectId: 'product-design',
    status: 'quote' as InvoiceFilter,
    amount: '¥360K',
    issued: { en: 'May 20', ja: '5月20日' },
    due: { en: 'May 27', ja: '5月27日' },
  },
  {
    id: 'inv-2038',
    title: { en: 'Discovery workshop', ja: '初期ワークショップ' },
    clientId: 'koma-supply',
    projectId: 'sprint-audit',
    status: 'overdue' as InvoiceFilter,
    amount: '¥240K',
    issued: { en: 'Apr 28', ja: '4月28日' },
    due: { en: 'May 12', ja: '5月12日' },
  },
  {
    id: 'inv-2032',
    title: { en: 'April support package', ja: '4月サポートパッケージ' },
    clientId: 'luma-craft',
    projectId: 'brand-retainer',
    status: 'paid' as InvoiceFilter,
    amount: '¥390K',
    issued: { en: 'Apr 25', ja: '4月25日' },
    due: { en: 'May 09', ja: '5月9日' },
  },
];

const tasks = [
  {
    id: 'task-quote-approval',
    title: { en: 'Approve revised quote for Bridgefield Labs', ja: 'Bridgefield Labs の改訂見積を承認' },
    due: { en: 'Today', ja: '本日' },
    owner: { en: 'Ops desk', ja: '業務窓口' },
    tone: 'amber' as Tone,
  },
  {
    id: 'task-payment-reminder',
    title: { en: 'Send reminder for overdue workshop invoice', ja: '期限超過のワークショップ請求を督促' },
    due: { en: 'Today', ja: '本日' },
    owner: { en: 'Finance lead', ja: '経理担当' },
    tone: 'rose' as Tone,
  },
  {
    id: 'task-monthly-close',
    title: { en: 'Prepare month-end billing batch', ja: '月末請求バッチを準備' },
    due: { en: 'Fri', ja: '金曜' },
    owner: { en: 'Producer desk', ja: '制作進行' },
    tone: 'neutral' as Tone,
  },
  {
    id: 'task-margin-review',
    title: { en: 'Review low margin on product support', ja: 'プロダクト支援の低粗利を確認' },
    due: { en: 'Fri', ja: '金曜' },
    owner: { en: 'Delivery lead', ja: '納品責任者' },
    tone: 'amber' as Tone,
  },
];

const monthlyRevenue = [
  { id: 'jan', label: 'Jan', value: '¥3.12M', progress: 58 },
  { id: 'feb', label: 'Feb', value: '¥3.46M', progress: 64 },
  { id: 'mar', label: 'Mar', value: '¥4.05M', progress: 75 },
  { id: 'apr', label: 'Apr', value: '¥4.10M', progress: 76 },
  { id: 'may', label: 'May', value: '¥4.82M', progress: 90 },
];

const recoveryRows = [
  { id: 'paid', status: 'paid' as StatusKey, amount: '¥2.92M', progress: 68 },
  { id: 'waiting', status: 'waiting' as StatusKey, amount: '¥1.31M', progress: 38 },
  { id: 'overdue', status: 'overdue' as StatusKey, amount: '¥240K', progress: 12 },
  { id: 'draft', status: 'draft' as StatusKey, amount: '¥420K', progress: 22 },
];

function localized(language: Language, en: string, ja: string) {
  return language === 'ja' ? ja : en;
}

function getClientName(clientId: string) {
  return clients.find((client) => client.id === clientId)?.name ?? clientId;
}

function getProjectName(projectId: string, language: Language) {
  return projects.find((project) => project.id === projectId)?.name[language] ?? projectId;
}

function getPreviewParam(keys: string[]) {
  if (typeof window === 'undefined') {
    return null;
  }

  const params = new URLSearchParams(window.location.search);

  for (const key of keys) {
    const value = params.get(key);

    if (value) {
      return value;
    }
  }

  return null;
}

function getInitialLanguage(): Language {
  const requested = getPreviewParam(['locale', 'lang', 'language', 'melius_locale']);

  if (requested === 'ja' || requested === 'en') {
    return requested;
  }

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (stored === 'ja' || stored === 'en') {
      return stored;
    }
  } catch {
    return 'en';
  }

  return window.navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

function getInitialTheme(): ThemeMode {
  const requested = getPreviewParam(['theme', 'themeMode', 'colorScheme', 'melius_theme']);

  if (requested === 'light' || requested === 'dark' || requested === 'system') {
    return requested;
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    return 'system';
  }

  const preference = document.documentElement.dataset.themePreference;
  return preference === 'light' || preference === 'dark' || preference === 'system' ? preference : 'system';
}

function resolveTheme(mode: ThemeMode) {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return mode;
}

function applyTheme(mode: ThemeMode) {
  const resolved = resolveTheme(mode);
  const root = document.documentElement;

  root.classList.toggle('dark', resolved === 'dark');
  root.dataset.theme = resolved;
  root.dataset.themePreference = mode;
  root.style.colorScheme = resolved;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Persistence is optional for this visual starter.
  }
}

function applyLanguage(language: Language, title: string) {
  document.documentElement.lang = language;
  document.title = title;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Persistence is optional for this visual starter.
  }
}

function getStatusTone(status: StatusKey): Tone {
  if (status === 'paid' || status === 'onTrack' || status === 'ready' || status === 'active') {
    return 'emerald';
  }

  if (status === 'overdue' || status === 'delayed' || status === 'unanswered') {
    return 'rose';
  }

  if (status === 'waiting' || status === 'atRisk' || status === 'quote' || status === 'sent') {
    return 'amber';
  }

  return 'neutral';
}

function ToneIcon({ tone, icon: Icon }: { tone: Tone; icon: LucideIcon }) {
  switch (tone) {
    case 'emerald':
      return (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-300/[0.14] dark:text-emerald-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      );
    case 'amber':
      return (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-300/[0.14] dark:text-amber-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      );
    case 'rose':
      return (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-300/[0.14] dark:text-rose-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      );
    case 'stone':
      return (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-stone-200 text-stone-800 dark:bg-stone-300/[0.14] dark:text-stone-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      );
    case 'neutral':
    default:
      return (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-800 dark:bg-zinc-300/[0.12] dark:text-zinc-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      );
  }
}

function StatusPill({ dataId, status, copy }: { dataId: string; status: StatusKey; copy: AppCopy }) {
  const label = copy.status[status];

  if (getStatusTone(status) === 'emerald') {
    return (
      <span data-melius-ui-id={dataId} data-melius-ui-role="status" className="inline-flex w-fit items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-300/[0.14] dark:text-emerald-200">
        {label}
      </span>
    );
  }

  if (getStatusTone(status) === 'rose') {
    return (
      <span data-melius-ui-id={dataId} data-melius-ui-role="status" className="inline-flex w-fit items-center rounded-md bg-rose-100 px-2 py-0.5 text-xs font-black text-rose-800 dark:bg-rose-300/[0.14] dark:text-rose-200">
        {label}
      </span>
    );
  }

  if (getStatusTone(status) === 'amber') {
    return (
      <span data-melius-ui-id={dataId} data-melius-ui-role="status" className="inline-flex w-fit items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-300/[0.14] dark:text-amber-200">
        {label}
      </span>
    );
  }

  return (
    <span data-melius-ui-id={dataId} data-melius-ui-role="status" className="inline-flex w-fit items-center rounded-md bg-zinc-950/[0.06] px-2 py-0.5 text-xs font-black text-zinc-700 dark:bg-white/[0.10] dark:text-zinc-200">
      {label}
    </span>
  );
}

function LanguageSwitcher({
  copy,
  language,
  onLanguageChange,
}: {
  copy: AppCopy;
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  return (
    <div
      data-melius-ui-id="language-switcher"
      data-melius-ui-role="control"
      aria-label={copy.language.label}
      className="hidden h-9 items-center rounded-lg border border-zinc-950/[0.08] bg-white/[0.70] p-1 text-xs font-black text-zinc-600 backdrop-blur dark:border-white/[0.10] dark:bg-white/[0.06] dark:text-zinc-300 sm:inline-flex"
    >
      <LanguageOptionButton selected={language === 'ja'} label={copy.language.ja} onClick={() => onLanguageChange('ja')} />
      <LanguageOptionButton selected={language === 'en'} label={copy.language.en} onClick={() => onLanguageChange('en')} />
    </div>
  );
}

function LanguageOptionButton({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  if (selected) {
    return (
      <button
        type="button"
        aria-pressed="true"
        onClick={onClick}
        className="h-7 min-w-8 rounded-md bg-zinc-950 px-2.5 text-white dark:bg-white dark:text-zinc-950"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed="false"
      onClick={onClick}
      className="h-7 min-w-8 rounded-md px-2.5 transition-colors hover:bg-zinc-950/[0.06] hover:text-zinc-950 dark:hover:bg-white/[0.10] dark:hover:text-white"
    >
      {label}
    </button>
  );
}

function ThemeSwitcher({
  copy,
  theme,
  onThemeChange,
}: {
  copy: AppCopy;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}) {
  return (
    <div
      data-melius-ui-id="theme-switcher"
      data-melius-ui-role="control"
      aria-label={copy.theme.label}
      className="hidden h-9 items-center rounded-lg border border-zinc-950/[0.08] bg-white/[0.70] p-1 text-xs font-black text-zinc-600 backdrop-blur dark:border-white/[0.10] dark:bg-white/[0.06] dark:text-zinc-300 lg:inline-flex"
    >
      <ThemeOptionButton selected={theme === 'light'} label={copy.theme.light} onClick={() => onThemeChange('light')} icon={Sun} />
      <ThemeOptionButton selected={theme === 'system'} label={copy.theme.system} onClick={() => onThemeChange('system')} icon={Monitor} />
      <ThemeOptionButton selected={theme === 'dark'} label={copy.theme.dark} onClick={() => onThemeChange('dark')} icon={Moon} />
    </div>
  );
}

function ThemeOptionButton({
  selected,
  label,
  onClick,
  icon: Icon,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}) {
  if (selected) {
    return (
      <button
        type="button"
        aria-pressed="true"
        title={label}
        onClick={onClick}
        className="inline-flex h-7 min-w-8 items-center justify-center gap-1.5 rounded-md bg-zinc-950 px-2.5 text-white dark:bg-white dark:text-zinc-950"
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden xl:inline">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed="false"
      title={label}
      onClick={onClick}
      className="inline-flex h-7 min-w-8 items-center justify-center gap-1.5 rounded-md px-2.5 transition-colors hover:bg-zinc-950/[0.06] hover:text-zinc-950 dark:hover:bg-white/[0.10] dark:hover:text-white"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
}

function SidebarContent({
  copy,
  language,
  activeTab,
  expandedItems,
  idPrefix,
  onSelectTab,
  onToggleExpanded,
  onUtilityAction,
  onCloseMobile,
}: {
  copy: AppCopy;
  language: Language;
  activeTab: TabId;
  expandedItems: Record<string, boolean>;
  idPrefix: 'desktop-nav' | 'mobile-nav';
  onSelectTab: (tab: TabId) => void;
  onToggleExpanded: (id: string) => void;
  onUtilityAction: (title: string, body: string, icon?: LucideIcon) => void;
  onCloseMobile?: () => void;
}) {
  return (
    <>
      <SidebarHeader data-melius-ui-id={`${idPrefix}-brand`} data-melius-ui-role="navigation">
        <BrandMark>
          <Landmark className="h-5 w-5" aria-hidden="true" />
        </BrandMark>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-black text-zinc-950 dark:text-white">{copy.appName}</div>
          <div className="truncate text-xs font-semibold text-zinc-500 dark:text-zinc-400">{copy.appSubtitle}</div>
        </div>
        {onCloseMobile ? (
          <IconButton dataId={`${idPrefix}-close`} roleName="button" label={copy.closeSidebar} onClick={onCloseMobile}>
            <X className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        ) : null}
      </SidebarHeader>

      <div className="px-3 py-3">
        <SearchInput
          dataId={`${idPrefix}-search`}
          roleName="search"
          label={copy.searchLabel}
          type="search"
          placeholder={copy.search}
          icon={<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />}
        />
      </div>

      <nav data-melius-ui-id={`${idPrefix}-navigation`} data-melius-ui-role="navigation" className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const sidebarCopy = copy.sidebar[item.id] as {
              title: string;
              badge?: string;
              children?: readonly string[];
            };
            const Icon = item.icon;
            const workspaceTab = tabs.includes(item.id as TabId) ? (item.id as TabId) : null;
            const selected = item.id === activeTab;
            const children = sidebarCopy.children ?? [];
            const badge = sidebarCopy.badge;
            const title = sidebarCopy.title;

            return (
              <div key={item.id}>
                <RowButton
                  dataId={`${idPrefix}-${item.id}`}
                  roleName="navigation-item"
                  selected={selected}
                  onClick={() => {
                    if (workspaceTab) {
                      onSelectTab(workspaceTab);
                    }
                    if (children.length > 0) {
                      onToggleExpanded(item.id);
                    } else {
                      onCloseMobile?.();
                    }
                    if (!workspaceTab) {
                      onUtilityAction(
                        title,
                        localized(language, `${title} settings are ready in the inspector.`, `${title} をインスペクターに表示しました。`),
                        Icon,
                      );
                    }
                  }}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{title}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {badge ? <Badge>{badge}</Badge> : null}
                    {children.length > 0 ? (
                      <ChevronDown
                        className={expandedItems[item.id] ? 'h-4 w-4 rotate-180 transition-transform' : 'h-4 w-4 transition-transform'}
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                </RowButton>

                {children.length > 0 && expandedItems[item.id] ? (
                  <div
                    data-melius-ui-id={`${idPrefix}-${item.id}-children`}
                    data-melius-ui-role="navigation-group"
                    className="ml-5 mt-1 space-y-1 border-l border-zinc-950/[0.08] pl-3 dark:border-white/[0.10]"
                  >
                    {children.map((child, childIndex) => (
                      <button
                        key={child}
                        type="button"
                        data-melius-ui-id={`${idPrefix}-${item.id}-child-${childIndex + 1}`}
                        data-melius-ui-role="navigation-item"
                        onClick={() => {
                          if (workspaceTab) {
                            onSelectTab(workspaceTab);
                          }
                          onUtilityAction(
                            `${title} / ${child}`,
                            localized(language, `${child} is filtered into the workspace inspector.`, `${child} をインスペクターで確認できます。`),
                            Icon,
                          );
                          onCloseMobile?.();
                        }}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-zinc-500 transition-colors hover:bg-zinc-950/[0.05] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.09] dark:hover:text-white"
                      >
                        {child}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </nav>

      <div data-melius-ui-id={`${idPrefix}-account`} data-melius-ui-role="account" className="border-t border-zinc-950/[0.08] p-3 dark:border-white/[0.08]">
        <RowButton
          dataId={`${idPrefix}-user-plan`}
          roleName="account"
          onClick={() => onUtilityAction(copy.userName, localized(language, 'Profile, team permissions, and approval limits are available here.', 'プロフィール、チーム権限、承認上限を確認できます。'), Users)}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gradient-to-br from-zinc-950 to-stone-700 text-xs font-black text-white">
              LD
            </span>
            <span className="truncate">{copy.userName}</span>
          </span>
          <Badge>{copy.plan}</Badge>
        </RowButton>
      </div>
    </>
  );
}

function SectionTitle({ title, action, actionId, onAction }: { title: string; action?: string; actionId?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-black tracking-normal text-zinc-950 dark:text-white">{title}</h2>
      {action ? (
        <GhostButton dataId={actionId ?? 'section-action'} roleName="button" onClick={onAction}>
          {action}
        </GhostButton>
      ) : null}
    </div>
  );
}

function FilterRail({ children, dataId }: { children: ReactNode; dataId: string }) {
  return (
    <div data-melius-ui-id={dataId} data-melius-ui-role="filter-group" className="flex flex-wrap gap-3">
      {children}
    </div>
  );
}

function FilterButton({
  dataId,
  selected,
  onClick,
  icon: Icon,
  children,
}: {
  dataId: string;
  selected: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      data-melius-ui-id={dataId}
      data-melius-ui-role="filter"
      aria-pressed={selected}
      onClick={onClick}
      className={
        selected
          ? 'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-zinc-950 bg-zinc-950 px-3.5 py-2 text-sm font-bold text-white shadow-sm shadow-zinc-950/10 dark:border-white dark:bg-white dark:text-zinc-950'
          : 'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-zinc-950/[0.10] bg-white/[0.74] px-3.5 py-2 text-sm font-bold text-zinc-800 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-zinc-100 dark:hover:bg-white/[0.13]'
      }
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

function EmptyState({ dataId, title, body }: { dataId: string; title: string; body: string }) {
  return (
    <PanelSurface data-melius-ui-id={dataId} data-melius-ui-role="empty-state">
      <div className="p-8 text-center">
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-lg bg-zinc-950/[0.06] text-zinc-700 dark:bg-white/[0.10] dark:text-zinc-200">
          <Search className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-black text-zinc-950 dark:text-white">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">{body}</p>
      </div>
    </PanelSurface>
  );
}

function getMetricPanel(metric: (typeof summaryMetrics)[number], copy: AppCopy, language: Language): InspectorPanel {
  return {
    eyebrow: localized(language, 'KPI detail', 'KPI詳細'),
    title: metric.label[language],
    body: metric.detail[language],
    icon: metric.icon,
    tone: metric.tone,
    meta: [
      { label: copy.labels.status, value: copy.status.ready },
      { label: copy.labels.amount, value: metric.value },
      { label: localized(language, 'Source', '集計元'), value: localized(language, 'Projects and invoices', '案件と請求') },
    ],
    presentation: 'inspector',
    primaryLabel: copy.actions.inspect,
    secondaryLabel: copy.exportReport,
  };
}

function getClientPanel(client: (typeof clients)[number], copy: AppCopy, language: Language): InspectorPanel {
  return {
    eyebrow: localized(language, 'Client detail', '顧客詳細'),
    title: client.name,
    body: client.notes[language],
    icon: Users,
    tone: getStatusTone(client.status),
    meta: [
      { label: copy.labels.lastContact, value: client.lastContact[language] },
      { label: copy.labels.unanswered, value: `${client.unattended}` },
      { label: copy.labels.forecast, value: client.forecast },
      { label: copy.labels.owner, value: client.owner[language] },
    ],
    presentation: 'inspector',
    primaryLabel: copy.actions.contact,
    secondaryLabel: copy.actions.open,
  };
}

function getProjectPanel(project: (typeof projects)[number], copy: AppCopy, language: Language): InspectorPanel {
  return {
    eyebrow: localized(language, 'Project detail', '案件詳細'),
    title: project.name[language],
    body: localized(
      language,
      `${getClientName(project.clientId)} is ${project.progress}% complete with expected margin at ${project.margin}.`,
      `${getClientName(project.clientId)} の案件は進捗 ${project.progress}%、粗利見込み ${project.margin} です。`,
    ),
    icon: Briefcase,
    tone: getStatusTone(project.status),
    meta: [
      { label: copy.labels.client, value: getClientName(project.clientId) },
      { label: copy.labels.due, value: project.due[language] },
      { label: copy.labels.margin, value: project.margin },
      { label: copy.labels.amount, value: project.amount },
    ],
    progress: project.progress,
    progressLabel: copy.labels.progress,
    presentation: 'modal',
    primaryLabel: copy.actions.open,
    secondaryLabel: copy.actions.approve,
  };
}

function getInvoicePanel(invoice: (typeof invoices)[number], status: InvoiceFilter, copy: AppCopy, language: Language): InspectorPanel {
  return {
    eyebrow: localized(language, 'Invoice detail', '請求詳細'),
    title: invoice.title[language],
    body: localized(
      language,
      `${getClientName(invoice.clientId)} / ${getProjectName(invoice.projectId, language)}. Review issue date, payment due date, and collection action.`,
      `${getClientName(invoice.clientId)} / ${getProjectName(invoice.projectId, language)}。発行日、支払期限、回収アクションを確認します。`,
    ),
    icon: Receipt,
    tone: getStatusTone(status as StatusKey),
    meta: [
      { label: copy.labels.client, value: getClientName(invoice.clientId) },
      { label: copy.labels.amount, value: invoice.amount },
      { label: copy.labels.issued, value: invoice.issued[language] },
      { label: copy.labels.paymentDue, value: invoice.due[language] },
      { label: copy.labels.status, value: copy.status[status as StatusKey] },
    ],
    presentation: status === 'overdue' || status === 'draft' || status === 'quote' ? 'modal' : 'inspector',
    primaryLabel: status === 'waiting' || status === 'overdue' ? copy.actions.markPaid : copy.actions.send,
    secondaryLabel: status === 'overdue' ? copy.actions.remind : copy.actions.duplicate,
  };
}

function getUtilityPanel(title: string, body: string, copy: AppCopy, language: Language, icon: LucideIcon = Settings): InspectorPanel {
  return {
    eyebrow: localized(language, 'Workspace panel', 'ワークスペースパネル'),
    title,
    body,
    icon,
    tone: 'neutral',
    meta: [
      { label: localized(language, 'Workspace', 'ワークスペース'), value: copy.appName },
      { label: copy.labels.owner, value: copy.userName },
      { label: copy.labels.status, value: copy.status.ready },
    ],
    presentation: 'inspector',
    primaryLabel: copy.actions.open,
    secondaryLabel: copy.actions.inspect,
  };
}

function SummaryBand({
  copy,
  language,
  onOpenPanel,
}: {
  copy: AppCopy;
  language: Language;
  onOpenPanel: OpenPanelHandler;
}) {
  return (
    <section data-melius-ui-id="workspace-summary-band" data-melius-ui-role="summary" className="overflow-hidden rounded-lg border border-zinc-950/[0.08] bg-white/[0.86] backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.055]">
      <div className="grid gap-4 border-b border-zinc-950/[0.08] p-5 dark:border-white/[0.08] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{copy.overview.updated}</Badge>
            <Badge>{localized(language, 'UI-only sample data', 'UI専用サンプルデータ')}</Badge>
          </div>
          <h2 data-melius-ui-id="summary-title" data-melius-ui-role="heading" className="mt-3 text-2xl font-black leading-tight text-zinc-950 dark:text-white sm:text-3xl">
            {copy.overview.title}
          </h2>
          <p data-melius-ui-id="summary-body" data-melius-ui-role="text" className="mt-2 max-w-3xl text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
            {copy.overview.body}
          </p>
        </div>
        <div data-melius-ui-id="summary-actions" data-melius-ui-role="actions" className="flex flex-wrap gap-2">
          <PrimaryButton
            dataId="summary-primary-action"
            roleName="button"
            onClick={() => onOpenPanel(getUtilityPanel(copy.overview.primary, localized(language, 'Draft invoices are grouped by ready-to-bill project work.', '請求可能な案件作業を下書き請求として整理しました。'), copy, language, Receipt), undefined, undefined, 'modal')}
          >
            <Receipt className="h-4 w-4" aria-hidden="true" />
            {copy.overview.primary}
          </PrimaryButton>
          <SecondaryButton
            dataId="summary-secondary-action"
            roleName="button"
            onClick={() => onOpenPanel(getUtilityPanel(copy.overview.secondary, localized(language, 'Late projects and overdue invoices are ready for review.', '遅延案件と期限超過請求を確認できます。'), copy, language, AlertTriangle))}
          >
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {copy.overview.secondary}
          </SecondaryButton>
        </div>
      </div>
      <div data-melius-ui-id="summary-kpi-grid" data-melius-ui-role="metrics" className="grid grid-cols-1 divide-y divide-zinc-950/[0.08] dark:divide-white/[0.08] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-5">
        {summaryMetrics.map((metric) => (
          <button
            key={metric.id}
            type="button"
            data-melius-ui-id={`summary-kpi-${metric.id}`}
            data-melius-ui-role="metric"
            onClick={() => onOpenPanel(getMetricPanel(metric, copy, language), metric.label[language])}
            className="group flex min-h-32 items-start gap-3 p-4 text-left transition-colors hover:bg-zinc-950/[0.035] dark:hover:bg-white/[0.045]"
          >
            <ToneIcon tone={metric.tone} icon={metric.icon} />
            <span className="min-w-0">
              <span className="block text-xs font-black uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{metric.label[language]}</span>
              <span className="mt-2 block text-2xl font-black text-zinc-950 dark:text-white">{metric.value}</span>
              <span className="mt-1 block text-sm font-semibold leading-5 text-zinc-500 dark:text-zinc-400">{metric.detail[language]}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function TaskQueue({
  copy,
  language,
  completedTaskIds,
  onToggleTask,
  onOpenPanel,
}: {
  copy: AppCopy;
  language: Language;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  onOpenPanel: OpenPanelHandler;
}) {
  return (
    <PanelSurface data-melius-ui-id="overview-task-queue" data-melius-ui-role="section">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-950/[0.08] p-4 dark:border-white/[0.08]">
        <h3 className="font-black text-zinc-950 dark:text-white">{copy.sections.taskQueue}</h3>
        <Badge>{tasks.length}</Badge>
      </div>
      <div className="divide-y divide-zinc-950/[0.08] dark:divide-white/[0.08]">
        {tasks.map((task) => {
          const completed = completedTaskIds.includes(task.id);

          return (
            <div key={task.id} data-melius-ui-id={`task-row-${task.id}`} data-melius-ui-role="list-item" className="grid gap-3 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
              <button
                type="button"
                data-melius-ui-id={`task-toggle-${task.id}`}
                data-melius-ui-role="button"
                aria-pressed={completed}
                onClick={() => onToggleTask(task.id)}
                className={completed ? 'grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-white' : 'grid h-9 w-9 place-items-center rounded-lg bg-zinc-950/[0.06] text-zinc-700 transition hover:bg-zinc-950/[0.10] dark:bg-white/[0.10] dark:text-zinc-200 dark:hover:bg-white/[0.16]'}
              >
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <div className={completed ? 'font-black text-zinc-500 line-through dark:text-zinc-400' : 'font-black text-zinc-950 dark:text-white'}>{task.title[language]}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  <span>{task.due[language]}</span>
                  <span>{task.owner[language]}</span>
                </div>
              </div>
              <GhostButton
                dataId={`task-open-${task.id}`}
                roleName="button"
                onClick={() => onOpenPanel(getUtilityPanel(task.title[language], localized(language, 'Task context, owner, due date, and next action are available here.', 'タスクの背景、担当、期限、次アクションを確認できます。'), copy, language, ClipboardList), task.title[language])}
              >
                {copy.actions.open}
              </GhostButton>
            </div>
          );
        })}
      </div>
    </PanelSurface>
  );
}

function OverviewContent({
  copy,
  language,
  completedTaskIds,
  onToggleTask,
  onNavigateTab,
  onOpenPanel,
}: {
  copy: AppCopy;
  language: Language;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  onNavigateTab: (tab: TabId) => void;
  onOpenPanel: OpenPanelHandler;
}) {
  const overdueInvoices = invoices.filter((invoice) => invoice.status === 'overdue' || invoice.status === 'waiting').slice(0, 3);

  return (
    <div className="space-y-6">
      <SummaryBand copy={copy} language={language} onOpenPanel={onOpenPanel} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)]">
        <section data-melius-ui-id="overview-payment-section" data-melius-ui-role="section" className="space-y-4">
          <SectionTitle title={copy.sections.paymentTimeline} action={copy.actions.viewAll} actionId="overview-invoices-view-all" onAction={() => onNavigateTab('invoices')} />
          <PanelSurface>
            <div className="divide-y divide-zinc-950/[0.08] dark:divide-white/[0.08]">
              {overdueInvoices.map((invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  status={invoice.status}
                  copy={copy}
                  language={language}
                  compact
                  onOpen={() => onOpenPanel(getInvoicePanel(invoice, invoice.status, copy, language), invoice.title[language])}
                  onMarkPaid={() => onOpenPanel(getInvoicePanel(invoice, invoice.status, copy, language), invoice.title[language], undefined, 'modal')}
                  onRemind={() => onOpenPanel(getInvoicePanel(invoice, invoice.status, copy, language), invoice.title[language], undefined, 'modal')}
                />
              ))}
            </div>
          </PanelSurface>
        </section>

        <section data-melius-ui-id="overview-task-section" data-melius-ui-role="section" className="space-y-4">
          <SectionTitle title={copy.sections.taskQueue} action={copy.actions.viewAll} actionId="overview-tasks-view-all" onAction={() => onOpenPanel(getUtilityPanel(copy.sections.taskQueue, localized(language, 'Weekly tasks are grouped by approvals, reminders, and billing close work.', '今週のタスクを承認、督促、請求締めで整理しました。'), copy, language, ClipboardList))} />
          <TaskQueue copy={copy} language={language} completedTaskIds={completedTaskIds} onToggleTask={onToggleTask} onOpenPanel={onOpenPanel} />
        </section>
      </div>

      <section data-melius-ui-id="overview-project-health-section" data-melius-ui-role="section" className="space-y-4">
        <SectionTitle title={copy.sections.projectMargin} action={copy.actions.viewAll} actionId="overview-projects-view-all" onAction={() => onNavigateTab('projects')} />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} copy={copy} language={language} onOpen={() => onOpenPanel(getProjectPanel(project, copy, language), project.name[language])} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ClientRow({
  client,
  copy,
  language,
  onOpen,
  onContact,
}: {
  client: (typeof clients)[number];
  copy: AppCopy;
  language: Language;
  onOpen: () => void;
  onContact: () => void;
}) {
  return (
    <div data-melius-ui-id={`client-row-${client.id}`} data-melius-ui-role="list-item" className="grid gap-3 p-4 transition-colors hover:bg-zinc-950/[0.035] dark:hover:bg-white/[0.045] lg:grid-cols-12 lg:items-center">
      <div className="min-w-0 lg:col-span-4">
        <div className="flex items-center gap-3">
          <ToneIcon tone={getStatusTone(client.status)} icon={Users} />
          <div className="min-w-0">
            <h3 className="truncate font-black text-zinc-950 dark:text-white">{client.name}</h3>
            <p className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">{client.segment[language]}</p>
          </div>
        </div>
      </div>
      <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 lg:col-span-2">{client.lastContact[language]}</div>
      <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 lg:col-span-2">{client.unattended}</div>
      <div className="text-sm font-black text-zinc-950 dark:text-white lg:col-span-2">{client.forecast}</div>
      <div className="flex items-center justify-between gap-2 lg:col-span-2">
        <StatusPill dataId={`client-status-${client.id}`} status={client.status} copy={copy} />
        <span className="flex items-center gap-1">
          <GhostButton dataId={`client-contact-${client.id}`} roleName="button" onClick={onContact}>
            {copy.actions.contact}
          </GhostButton>
          <IconButton dataId={`client-open-${client.id}`} roleName="button" label={copy.actions.open} onClick={onOpen}>
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </span>
      </div>
    </div>
  );
}

function ClientsContent({
  copy,
  language,
  clientFilter,
  onClientFilterChange,
  clientSearch,
  onClientSearchChange,
  onOpenPanel,
  onShowNotice,
}: {
  copy: AppCopy;
  language: Language;
  clientFilter: ClientFilter;
  onClientFilterChange: (filter: ClientFilter) => void;
  clientSearch: string;
  onClientSearchChange: (value: string) => void;
  onOpenPanel: OpenPanelHandler;
  onShowNotice: ShowNoticeHandler;
}) {
  const query = clientSearch.trim().toLowerCase();
  const filteredClients = clients.filter((client) => {
    if (clientFilter === 'unanswered' && client.unattended === 0) {
      return false;
    }
    if (clientFilter === 'highValue' && client.valueRank < 4) {
      return false;
    }
    if (clientFilter === 'recent' && !['May 20', 'May 21'].includes(client.lastContact.en)) {
      return false;
    }
    if (!query) {
      return true;
    }
    return `${client.name} ${client.segment[language]} ${client.owner[language]}`.toLowerCase().includes(query);
  });
  const setFilter = (filter: ClientFilter, label: string) => {
    onClientFilterChange(filter);
    onShowNotice(label, localized(language, 'Client list updated.', '顧客一覧を更新しました。'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <FilterRail dataId="client-filters">
          <FilterButton dataId="filter-clients-all" selected={clientFilter === 'all'} onClick={() => setFilter('all', copy.filters.all)} icon={Users}>{copy.filters.all}</FilterButton>
          <FilterButton dataId="filter-clients-unanswered" selected={clientFilter === 'unanswered'} onClick={() => setFilter('unanswered', copy.filters.unanswered)} icon={MessageSquare}>{copy.filters.unanswered}</FilterButton>
          <FilterButton dataId="filter-clients-high-value" selected={clientFilter === 'highValue'} onClick={() => setFilter('highValue', copy.filters.highValue)} icon={Wallet}>{copy.filters.highValue}</FilterButton>
          <FilterButton dataId="filter-clients-recent" selected={clientFilter === 'recent'} onClick={() => setFilter('recent', copy.filters.recent)} icon={Clock}>{copy.filters.recent}</FilterButton>
        </FilterRail>
        <div className="min-w-[240px] lg:ml-auto">
          <SearchInput
            dataId="clients-search"
            roleName="search"
            label={copy.searchLabel}
            type="search"
            placeholder={copy.search}
            value={clientSearch}
            onChange={(event) => onClientSearchChange(event.target.value)}
            icon={<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />}
          />
        </div>
      </div>

      <section data-melius-ui-id="client-pipeline-section" data-melius-ui-role="section" className="space-y-4">
        <SectionTitle title={copy.sections.clientPipeline} action={copy.newInvoice} actionId="clients-new-invoice-action" onAction={() => onOpenPanel(getUtilityPanel(copy.newInvoice, localized(language, 'A draft invoice can be started from selected client work.', '選択した顧客作業から請求書の下書きを開始できます。'), copy, language, Receipt), undefined, undefined, 'modal')} />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {clients.slice(0, 3).map((client) => (
            <CardSurface key={client.id} data-melius-ui-id={`client-pipeline-card-${client.id}`} data-melius-ui-role="card">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <ToneIcon tone={getStatusTone(client.status)} icon={Users} />
                  <StatusPill dataId={`client-pipeline-status-${client.id}`} status={client.status} copy={copy} />
                </div>
                <h3 className="mt-4 text-lg font-black text-zinc-950 dark:text-white">{client.name}</h3>
                <p className="mt-1 text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">{client.notes[language]}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{copy.labels.forecast}</div>
                    <div className="mt-1 text-xl font-black text-zinc-950 dark:text-white">{client.forecast}</div>
                  </div>
                  <SecondaryButton dataId={`client-pipeline-open-${client.id}`} roleName="button" onClick={() => onOpenPanel(getClientPanel(client, copy, language), client.name)}>
                    {copy.actions.open}
                  </SecondaryButton>
                </div>
              </div>
            </CardSurface>
          ))}
        </div>
      </section>

      <section data-melius-ui-id="client-table-section" data-melius-ui-role="section" className="space-y-4">
        <SectionTitle title={copy.sections.clientTable} />
        <PanelSurface>
          <div className="hidden grid-cols-12 bg-zinc-950/[0.045] p-3 text-sm font-black text-zinc-600 dark:bg-white/[0.055] dark:text-zinc-300 lg:grid">
            <div className="col-span-4">{copy.labels.client}</div>
            <div className="col-span-2">{copy.labels.lastContact}</div>
            <div className="col-span-2">{copy.labels.unanswered}</div>
            <div className="col-span-2">{copy.labels.forecast}</div>
            <div className="col-span-2">{copy.labels.status}</div>
          </div>
          <div className="divide-y divide-zinc-950/[0.08] dark:divide-white/[0.08]">
            {filteredClients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                copy={copy}
                language={language}
                onOpen={() => onOpenPanel(getClientPanel(client, copy, language), client.name)}
                onContact={() => onOpenPanel(getClientPanel(client, copy, language), localized(language, 'Contact panel opened', '連絡パネルを開きました'), client.name)}
              />
            ))}
          </div>
        </PanelSurface>
        {filteredClients.length === 0 ? (
          <EmptyState dataId="clients-empty-state" title={localized(language, 'No clients match this view', '条件に合う顧客はありません')} body={localized(language, 'Clear search or choose another client filter.', '検索を消すか別の顧客フィルターを選んでください。')} />
        ) : null}
      </section>
    </div>
  );
}

function ProjectCard({
  project,
  copy,
  language,
  onOpen,
}: {
  project: (typeof projects)[number];
  copy: AppCopy;
  language: Language;
  onOpen: () => void;
}) {
  return (
    <CardSurface data-melius-ui-id={`project-card-${project.id}`} data-melius-ui-role="card">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-zinc-950 dark:text-white">{project.name[language]}</h3>
            <p className="mt-1 truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">{getClientName(project.clientId)}</p>
          </div>
          <StatusPill dataId={`project-status-${project.id}`} status={project.status} copy={copy} />
        </div>
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            <span>{copy.labels.progress}</span>
            <span>{project.progress}%</span>
          </div>
          <ProgressBar dataId={`project-progress-${project.id}`} value={project.progress} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.10em] text-zinc-500 dark:text-zinc-400">{copy.labels.due}</div>
            <div className="mt-1 font-black text-zinc-950 dark:text-white">{project.due[language]}</div>
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-[0.10em] text-zinc-500 dark:text-zinc-400">{copy.labels.margin}</div>
            <div className="mt-1 font-black text-zinc-950 dark:text-white">{project.margin}</div>
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-[0.10em] text-zinc-500 dark:text-zinc-400">{copy.labels.amount}</div>
            <div className="mt-1 font-black text-zinc-950 dark:text-white">{project.amount}</div>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-2">
          <Badge>{project.owner[language]}</Badge>
          <SecondaryButton dataId={`project-open-${project.id}`} roleName="button" onClick={onOpen}>
            {copy.actions.open}
          </SecondaryButton>
        </div>
      </div>
    </CardSurface>
  );
}

function ProjectsContent({
  copy,
  language,
  projectFilter,
  onProjectFilterChange,
  projectSearch,
  onProjectSearchChange,
  onOpenPanel,
  onShowNotice,
}: {
  copy: AppCopy;
  language: Language;
  projectFilter: ProjectFilter;
  onProjectFilterChange: (filter: ProjectFilter) => void;
  projectSearch: string;
  onProjectSearchChange: (value: string) => void;
  onOpenPanel: OpenPanelHandler;
  onShowNotice: ShowNoticeHandler;
}) {
  const query = projectSearch.trim().toLowerCase();
  const filteredProjects = projects.filter((project) => {
    if (projectFilter === 'onTrack' && project.status !== 'onTrack') {
      return false;
    }
    if (projectFilter === 'atRisk' && project.status !== 'atRisk') {
      return false;
    }
    if (projectFilter === 'delayed' && project.status !== 'delayed') {
      return false;
    }
    if (!query) {
      return true;
    }
    return `${project.name[language]} ${getClientName(project.clientId)} ${project.owner[language]}`.toLowerCase().includes(query);
  });
  const setFilter = (filter: ProjectFilter, label: string) => {
    onProjectFilterChange(filter);
    onShowNotice(label, localized(language, 'Project list updated.', '案件一覧を更新しました。'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <FilterRail dataId="project-filters">
          <FilterButton dataId="filter-projects-all" selected={projectFilter === 'all'} onClick={() => setFilter('all', copy.filters.all)} icon={Briefcase}>{copy.filters.all}</FilterButton>
          <FilterButton dataId="filter-projects-on-track" selected={projectFilter === 'onTrack'} onClick={() => setFilter('onTrack', copy.filters.onTrack)} icon={CheckCircle2}>{copy.filters.onTrack}</FilterButton>
          <FilterButton dataId="filter-projects-at-risk" selected={projectFilter === 'atRisk'} onClick={() => setFilter('atRisk', copy.filters.atRisk)} icon={AlertTriangle}>{copy.filters.atRisk}</FilterButton>
          <FilterButton dataId="filter-projects-delayed" selected={projectFilter === 'delayed'} onClick={() => setFilter('delayed', copy.filters.delayed)} icon={Clock}>{copy.filters.delayed}</FilterButton>
        </FilterRail>
        <div className="min-w-[240px] lg:ml-auto">
          <SearchInput
            dataId="projects-search"
            roleName="search"
            label={copy.searchLabel}
            type="search"
            placeholder={copy.search}
            value={projectSearch}
            onChange={(event) => onProjectSearchChange(event.target.value)}
            icon={<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />}
          />
        </div>
      </div>

      <section data-melius-ui-id="project-board-section" data-melius-ui-role="section" className="space-y-4">
        <SectionTitle title={copy.sections.projectBoard} action={copy.actions.sort} actionId="projects-sort-action" onAction={() => onShowNotice(copy.actions.sort, localized(language, 'Projects are grouped by status and due date.', '案件を状態と納期で並び替えました。'))} />
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} copy={copy} language={language} onOpen={() => onOpenPanel(getProjectPanel(project, copy, language), project.name[language])} />
            ))}
          </div>
        ) : (
          <EmptyState dataId="projects-empty-state" title={localized(language, 'No projects match this view', '条件に合う案件はありません')} body={localized(language, 'Clear search or choose another project status.', '検索を消すか別の案件状態を選んでください。')} />
        )}
      </section>

      <section data-melius-ui-id="project-margin-section" data-melius-ui-role="section" className="space-y-4">
        <SectionTitle title={copy.sections.projectMargin} />
        <PanelSurface>
          <div className="divide-y divide-zinc-950/[0.08] dark:divide-white/[0.08]">
            {projects.map((project) => (
              <div key={project.id} data-melius-ui-id={`margin-row-${project.id}`} data-melius-ui-role="list-item" className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_6rem_7rem_auto] md:items-center">
                <div className="min-w-0">
                  <div className="font-black text-zinc-950 dark:text-white">{project.name[language]}</div>
                  <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{getClientName(project.clientId)}</div>
                </div>
                <div className="text-sm font-black text-zinc-950 dark:text-white">{project.margin}</div>
                <StatusPill dataId={`margin-status-${project.id}`} status={project.status} copy={copy} />
                <GhostButton dataId={`margin-open-${project.id}`} roleName="button" onClick={() => onOpenPanel(getProjectPanel(project, copy, language), project.name[language])}>
                  {copy.actions.inspect}
                </GhostButton>
              </div>
            ))}
          </div>
        </PanelSurface>
      </section>
    </div>
  );
}

function InvoiceRow({
  invoice,
  status,
  copy,
  language,
  compact,
  onOpen,
  onMarkPaid,
  onRemind,
}: {
  invoice: (typeof invoices)[number];
  status: InvoiceFilter;
  copy: AppCopy;
  language: Language;
  compact?: boolean;
  onOpen: () => void;
  onMarkPaid: () => void;
  onRemind: () => void;
}) {
  return (
    <div data-melius-ui-id={`invoice-row-${invoice.id}`} data-melius-ui-role="list-item" className={compact ? 'grid gap-3 p-4 transition-colors hover:bg-zinc-950/[0.035] dark:hover:bg-white/[0.045] md:grid-cols-[minmax(0,1fr)_7rem_auto] md:items-center' : 'grid gap-3 p-4 transition-colors hover:bg-zinc-950/[0.035] dark:hover:bg-white/[0.045] lg:grid-cols-12 lg:items-center'}>
      <div className={compact ? 'min-w-0' : 'min-w-0 lg:col-span-4'}>
        <div className="font-black text-zinc-950 dark:text-white">{invoice.title[language]}</div>
        <div className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">{getClientName(invoice.clientId)} / {getProjectName(invoice.projectId, language)}</div>
      </div>
      {compact ? null : <div className="text-sm font-black text-zinc-950 dark:text-white lg:col-span-2">{invoice.amount}</div>}
      {compact ? null : <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 lg:col-span-2">{invoice.issued[language]}</div>}
      <div className={compact ? 'text-sm font-black text-zinc-950 dark:text-white' : 'text-sm font-semibold text-zinc-600 dark:text-zinc-300 lg:col-span-2'}>{invoice.due[language]}</div>
      <div className={compact ? 'flex items-center justify-between gap-2' : 'flex items-center justify-between gap-2 lg:col-span-2'}>
        <StatusPill dataId={`invoice-status-${invoice.id}`} status={status as StatusKey} copy={copy} />
        <span className="flex items-center gap-1">
          {status === 'waiting' || status === 'overdue' ? (
            <GhostButton dataId={`invoice-paid-${invoice.id}`} roleName="button" onClick={onMarkPaid}>
              {copy.actions.markPaid}
            </GhostButton>
          ) : null}
          {status === 'overdue' ? (
            <IconButton dataId={`invoice-remind-${invoice.id}`} roleName="button" label={copy.actions.remind} onClick={onRemind}>
              <Send className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          ) : null}
          <IconButton dataId={`invoice-open-${invoice.id}`} roleName="button" label={copy.actions.open} onClick={onOpen}>
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </span>
      </div>
    </div>
  );
}

function InvoicesContent({
  copy,
  language,
  invoiceFilter,
  onInvoiceFilterChange,
  invoiceSearch,
  onInvoiceSearchChange,
  invoiceStatusById,
  onMarkPaid,
  onOpenPanel,
  onShowNotice,
}: {
  copy: AppCopy;
  language: Language;
  invoiceFilter: InvoiceFilter;
  onInvoiceFilterChange: (filter: InvoiceFilter) => void;
  invoiceSearch: string;
  onInvoiceSearchChange: (value: string) => void;
  invoiceStatusById: Record<string, InvoiceFilter>;
  onMarkPaid: (invoiceId: string) => void;
  onOpenPanel: OpenPanelHandler;
  onShowNotice: ShowNoticeHandler;
}) {
  const query = invoiceSearch.trim().toLowerCase();
  const filteredInvoices = invoices.filter((invoice) => {
    const status = invoiceStatusById[invoice.id] ?? invoice.status;
    if (invoiceFilter !== 'all' && status !== invoiceFilter) {
      return false;
    }
    if (!query) {
      return true;
    }
    return `${invoice.title[language]} ${getClientName(invoice.clientId)} ${invoice.amount} ${getProjectName(invoice.projectId, language)}`.toLowerCase().includes(query);
  });
  const setFilter = (filter: InvoiceFilter, label: string) => {
    onInvoiceFilterChange(filter);
    onShowNotice(label, localized(language, 'Invoice list updated.', '請求一覧を更新しました。'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <FilterRail dataId="invoice-filters">
          <FilterButton dataId="filter-invoices-all" selected={invoiceFilter === 'all'} onClick={() => setFilter('all', copy.filters.all)} icon={Receipt}>{copy.filters.all}</FilterButton>
          <FilterButton dataId="filter-invoices-quote" selected={invoiceFilter === 'quote'} onClick={() => setFilter('quote', copy.filters.quote)} icon={FileText}>{copy.filters.quote}</FilterButton>
          <FilterButton dataId="filter-invoices-draft" selected={invoiceFilter === 'draft'} onClick={() => setFilter('draft', copy.filters.draft)} icon={FileText}>{copy.filters.draft}</FilterButton>
          <FilterButton dataId="filter-invoices-waiting" selected={invoiceFilter === 'waiting'} onClick={() => setFilter('waiting', copy.filters.waiting)} icon={Clock}>{copy.filters.waiting}</FilterButton>
          <FilterButton dataId="filter-invoices-overdue" selected={invoiceFilter === 'overdue'} onClick={() => setFilter('overdue', copy.filters.overdue)} icon={AlertTriangle}>{copy.filters.overdue}</FilterButton>
          <FilterButton dataId="filter-invoices-paid" selected={invoiceFilter === 'paid'} onClick={() => setFilter('paid', copy.filters.paid)} icon={CheckCircle2}>{copy.filters.paid}</FilterButton>
        </FilterRail>
        <div className="min-w-[240px] lg:ml-auto">
          <SearchInput
            dataId="invoices-search"
            roleName="search"
            label={copy.searchLabel}
            type="search"
            placeholder={copy.search}
            value={invoiceSearch}
            onChange={(event) => onInvoiceSearchChange(event.target.value)}
            icon={<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />}
          />
        </div>
      </div>

      <section data-melius-ui-id="invoice-list-section" data-melius-ui-role="section" className="space-y-4">
        <SectionTitle title={copy.sections.invoiceList} action={copy.newInvoice} actionId="invoice-new-action" onAction={() => onOpenPanel(getUtilityPanel(copy.newInvoice, localized(language, 'A new invoice draft opens with client, project, and tax fields ready.', '顧客、案件、税区分を含む請求下書きを開始できます。'), copy, language, Plus), undefined, undefined, 'modal')} />
        <PanelSurface>
          <div className="hidden grid-cols-12 bg-zinc-950/[0.045] p-3 text-sm font-black text-zinc-600 dark:bg-white/[0.055] dark:text-zinc-300 lg:grid">
            <div className="col-span-4">{copy.labels.project}</div>
            <div className="col-span-2">{copy.labels.amount}</div>
            <div className="col-span-2">{copy.labels.issued}</div>
            <div className="col-span-2">{copy.labels.paymentDue}</div>
            <div className="col-span-2">{copy.labels.status}</div>
          </div>
          <div className="divide-y divide-zinc-950/[0.08] dark:divide-white/[0.08]">
            {filteredInvoices.map((invoice) => {
              const status = invoiceStatusById[invoice.id] ?? invoice.status;

              return (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  status={status}
                  copy={copy}
                  language={language}
                  onOpen={() => onOpenPanel(getInvoicePanel(invoice, status, copy, language), invoice.title[language])}
                  onMarkPaid={() => {
                    onMarkPaid(invoice.id);
                    onShowNotice(copy.actions.markPaid, invoice.title[language]);
                  }}
                  onRemind={() => onOpenPanel(getInvoicePanel(invoice, status, copy, language), localized(language, 'Reminder drafted', '督促文を準備しました'), invoice.title[language], 'modal')}
                />
              );
            })}
          </div>
        </PanelSurface>
        {filteredInvoices.length === 0 ? (
          <EmptyState dataId="invoices-empty-state" title={localized(language, 'No invoices match this view', '条件に合う請求はありません')} body={localized(language, 'Clear search or choose another invoice status.', '検索を消すか別の請求状態を選んでください。')} />
        ) : null}
      </section>
    </div>
  );
}

function ReportsContent({
  copy,
  language,
  reportRange,
  onReportRangeChange,
  onOpenPanel,
  onShowNotice,
}: {
  copy: AppCopy;
  language: Language;
  reportRange: ReportRange;
  onReportRangeChange: (range: ReportRange) => void;
  onOpenPanel: OpenPanelHandler;
  onShowNotice: ShowNoticeHandler;
}) {
  const setRange = (range: ReportRange, label: string) => {
    onReportRangeChange(range);
    onShowNotice(label, localized(language, 'Report range changed.', 'レポート期間を切り替えました。'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <FilterRail dataId="report-range-filters">
          <FilterButton dataId="filter-reports-month" selected={reportRange === 'month'} onClick={() => setRange('month', copy.filters.month)} icon={CalendarDays}>{copy.filters.month}</FilterButton>
          <FilterButton dataId="filter-reports-quarter" selected={reportRange === 'quarter'} onClick={() => setRange('quarter', copy.filters.quarter)} icon={BarChart3}>{copy.filters.quarter}</FilterButton>
          <FilterButton dataId="filter-reports-year" selected={reportRange === 'year'} onClick={() => setRange('year', copy.filters.year)} icon={Landmark}>{copy.filters.year}</FilterButton>
        </FilterRail>
        <div className="lg:ml-auto">
          <SecondaryButton dataId="reports-export-action" roleName="button" onClick={() => onOpenPanel(getUtilityPanel(copy.exportReport, localized(language, 'Revenue, margin, utilization, and collection summaries are ready for export.', '売上、粗利、稼働、回収状況を出力できます。'), copy, language, Download), undefined, undefined, 'modal')}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {copy.exportReport}
          </SecondaryButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section data-melius-ui-id="revenue-report-section" data-melius-ui-role="section" className="space-y-4">
          <SectionTitle title={copy.sections.revenueReport} />
          <PanelSurface>
            <div className="space-y-4 p-5">
              {monthlyRevenue.map((row) => (
                <div key={row.id} data-melius-ui-id={`revenue-row-${row.id}`} data-melius-ui-role="chart-row" className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                    <span>{row.label}</span>
                    <span className="font-black text-zinc-950 dark:text-white">{row.value}</span>
                  </div>
                  <ProgressBar dataId={`revenue-progress-${row.id}`} value={row.progress} />
                </div>
              ))}
            </div>
          </PanelSurface>
        </section>

        <section data-melius-ui-id="recovery-report-section" data-melius-ui-role="section" className="space-y-4">
          <SectionTitle title={copy.sections.recoveryReport} />
          <PanelSurface>
            <div className="space-y-4 p-5">
              {recoveryRows.map((row) => (
                <div key={row.id} data-melius-ui-id={`recovery-row-${row.id}`} data-melius-ui-role="chart-row" className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <StatusPill dataId={`recovery-status-${row.id}`} status={row.status} copy={copy} />
                    <span className="text-sm font-black text-zinc-950 dark:text-white">{row.amount}</span>
                  </div>
                  <ProgressBar dataId={`recovery-progress-${row.id}`} value={row.progress} />
                </div>
              ))}
            </div>
          </PanelSurface>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section data-melius-ui-id="margin-report-section" data-melius-ui-role="section" className="space-y-4">
          <SectionTitle title={copy.sections.marginReport} />
          <PanelSurface>
            <div className="divide-y divide-zinc-950/[0.08] dark:divide-white/[0.08]">
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  data-melius-ui-id={`report-margin-row-${project.id}`}
                  data-melius-ui-role="list-item"
                  onClick={() => onOpenPanel(getProjectPanel(project, copy, language), project.name[language])}
                  className="grid w-full gap-3 p-4 text-left transition-colors hover:bg-zinc-950/[0.035] dark:hover:bg-white/[0.045] md:grid-cols-[minmax(0,1fr)_6rem_7rem] md:items-center"
                >
                  <span className="min-w-0">
                    <span className="block font-black text-zinc-950 dark:text-white">{project.name[language]}</span>
                    <span className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">{getClientName(project.clientId)}</span>
                  </span>
                  <span className="font-black text-zinc-950 dark:text-white">{project.margin}</span>
                  <StatusPill dataId={`report-margin-status-${project.id}`} status={project.status} copy={copy} />
                </button>
              ))}
            </div>
          </PanelSurface>
        </section>

        <section data-melius-ui-id="utilization-report-section" data-melius-ui-role="section" className="space-y-4">
          <SectionTitle title={copy.sections.utilizationReport} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { id: 'delivery', label: localized(language, 'Delivery', '納品'), value: 84 },
              { id: 'design', label: localized(language, 'Design', '設計'), value: 76 },
              { id: 'consulting', label: localized(language, 'Consulting', 'コンサル'), value: 62 },
              { id: 'admin', label: localized(language, 'Billing admin', '請求事務'), value: 41 },
            ].map((item) => (
              <CardSurface key={item.id} data-melius-ui-id={`utilization-card-${item.id}`} data-melius-ui-role="card">
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black text-zinc-950 dark:text-white">{item.label}</h3>
                    <Badge>{item.value}%</Badge>
                  </div>
                  <div className="mt-4">
                    <ProgressBar dataId={`utilization-progress-${item.id}`} value={item.value} />
                  </div>
                </div>
              </CardSurface>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ActionInspector({
  panel,
  onClose,
  onPrimary,
  onSecondary,
}: {
  panel: InspectorPanel;
  onClose: () => void;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const Icon = panel.icon ?? Settings;

  return (
    <aside
      data-melius-ui-id="workspace-action-inspector"
      data-melius-ui-role="panel"
      className="inspector-enter fixed inset-x-3 bottom-3 z-50 max-h-[min(38rem,calc(100svh-1.5rem))] overflow-hidden rounded-lg border border-zinc-950/[0.10] bg-white/[0.96] shadow-2xl shadow-zinc-950/20 backdrop-blur-xl dark:border-white/[0.12] dark:bg-zinc-950/[0.96] sm:inset-x-auto sm:right-4 sm:top-[4.25rem] sm:bottom-4 sm:w-[24rem]"
    >
      <div className="thin-scrollbar flex max-h-[inherit] flex-col overflow-y-auto">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-950/[0.08] p-4 dark:border-white/[0.08]">
          <div className="flex min-w-0 items-center gap-3">
            <ToneIcon tone={panel.tone ?? 'neutral'} icon={Icon} />
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">{panel.eyebrow}</div>
              <h2 className="mt-1 truncate text-lg font-black text-zinc-950 dark:text-white">{panel.title}</h2>
            </div>
          </div>
          <IconButton dataId="workspace-action-inspector-close" roleName="button" label="Close" onClick={onClose}>
            <X className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>

        <div className="space-y-4 p-4">
          <p data-melius-ui-id="workspace-action-inspector-body" data-melius-ui-role="text" className="text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
            {panel.body}
          </p>

          {typeof panel.progress === 'number' ? (
            <div data-melius-ui-id="workspace-action-inspector-progress-block" data-melius-ui-role="status" className="space-y-2">
              <div className="flex items-center justify-between text-sm font-bold text-zinc-600 dark:text-zinc-300">
                <span>{panel.progressLabel ?? 'Progress'}</span>
                <span>{panel.progress}%</span>
              </div>
              <ProgressBar dataId="workspace-action-inspector-progress" value={panel.progress} />
            </div>
          ) : null}

          <div data-melius-ui-id="workspace-action-inspector-meta" data-melius-ui-role="list" className="divide-y divide-zinc-950/[0.08] overflow-hidden rounded-lg border border-zinc-950/[0.08] dark:divide-white/[0.08] dark:border-white/[0.10]">
            {panel.meta.map((item, index) => (
              <div key={`${item.label}-${index}`} data-melius-ui-id={`workspace-action-inspector-meta-${index + 1}`} data-melius-ui-role="list-item" className="flex items-center justify-between gap-3 px-3 py-2.5">
                <span className="text-xs font-bold uppercase tracking-[0.10em] text-zinc-500 dark:text-zinc-400">{item.label}</span>
                <span className="text-right text-sm font-black text-zinc-950 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>

          <div data-melius-ui-id="workspace-action-inspector-actions" data-melius-ui-role="actions" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <PrimaryButton dataId="workspace-action-inspector-primary" roleName="button" onClick={onPrimary}>
              {panel.primaryLabel}
            </PrimaryButton>
            <SecondaryButton dataId="workspace-action-inspector-secondary" roleName="button" onClick={onSecondary}>
              {panel.secondaryLabel}
            </SecondaryButton>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ActionModal({
  panel,
  onClose,
  onPrimary,
  onSecondary,
}: {
  panel: InspectorPanel;
  onClose: () => void;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const Icon = panel.icon ?? Settings;

  return (
    <div
      data-melius-ui-id="workspace-action-modal-overlay"
      data-melius-ui-role="overlay"
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/40 p-3 backdrop-blur-sm sm:p-6"
    >
      <section
        data-melius-ui-id="workspace-action-modal"
        data-melius-ui-role="dialog"
        onClick={(event) => event.stopPropagation()}
        className="modal-enter thin-scrollbar max-h-[min(42rem,calc(100svh-2rem))] w-full max-w-2xl overflow-y-auto rounded-lg border border-zinc-950/[0.10] bg-white/[0.97] shadow-2xl shadow-zinc-950/25 backdrop-blur-xl dark:border-white/[0.12] dark:bg-zinc-950/[0.97]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-950/[0.08] p-5 dark:border-white/[0.08]">
          <div className="flex min-w-0 items-center gap-3">
            <ToneIcon tone={panel.tone ?? 'neutral'} icon={Icon} />
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">{panel.eyebrow}</div>
              <h2 className="mt-1 text-2xl font-black leading-tight text-zinc-950 dark:text-white">{panel.title}</h2>
            </div>
          </div>
          <IconButton dataId="workspace-action-modal-close" roleName="button" label="Close" onClick={onClose}>
            <X className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="space-y-4">
            <p data-melius-ui-id="workspace-action-modal-body" data-melius-ui-role="text" className="text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">
              {panel.body}
            </p>

            {typeof panel.progress === 'number' ? (
              <div data-melius-ui-id="workspace-action-modal-progress-block" data-melius-ui-role="status" className="space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-zinc-600 dark:text-zinc-300">
                  <span>{panel.progressLabel ?? 'Progress'}</span>
                  <span>{panel.progress}%</span>
                </div>
                <ProgressBar dataId="workspace-action-modal-progress" value={panel.progress} />
              </div>
            ) : null}

            <div data-melius-ui-id="workspace-action-modal-actions" data-melius-ui-role="actions" className="flex flex-col gap-2 sm:flex-row">
              <PrimaryButton dataId="workspace-action-modal-primary" roleName="button" onClick={onPrimary}>
                {panel.primaryLabel}
              </PrimaryButton>
              <SecondaryButton dataId="workspace-action-modal-secondary" roleName="button" onClick={onSecondary}>
                {panel.secondaryLabel}
              </SecondaryButton>
            </div>
          </div>

          <div data-melius-ui-id="workspace-action-modal-meta" data-melius-ui-role="list" className="divide-y divide-zinc-950/[0.08] overflow-hidden rounded-lg border border-zinc-950/[0.08] bg-zinc-950/[0.025] dark:divide-white/[0.08] dark:border-white/[0.10] dark:bg-white/[0.04]">
            {panel.meta.map((item, index) => (
              <div key={`${item.label}-${index}`} data-melius-ui-id={`workspace-action-modal-meta-${index + 1}`} data-melius-ui-role="list-item" className="px-3 py-3">
                <div className="text-xs font-bold uppercase tracking-[0.10em] text-zinc-500 dark:text-zinc-400">{item.label}</div>
                <div className="mt-1 text-base font-black text-zinc-950 dark:text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkspaceToast({ notice, raised, onDismiss }: { notice: NoticeState; raised: boolean; onDismiss: () => void }) {
  return (
    <div
      data-melius-ui-id="workspace-action-toast"
      data-melius-ui-role="status"
      className={
        raised
          ? 'toast-enter fixed inset-x-3 top-16 z-[60] flex items-start gap-3 rounded-lg border border-zinc-950/[0.10] bg-white/[0.96] p-3 shadow-xl shadow-zinc-950/15 backdrop-blur-xl dark:border-white/[0.12] dark:bg-zinc-950/[0.96] sm:inset-x-auto sm:left-auto sm:right-4 sm:top-auto sm:bottom-3 sm:w-[22rem]'
          : 'toast-enter fixed inset-x-3 bottom-3 z-[60] flex items-start gap-3 rounded-lg border border-zinc-950/[0.10] bg-white/[0.96] p-3 shadow-xl shadow-zinc-950/15 backdrop-blur-xl dark:border-white/[0.12] dark:bg-zinc-950/[0.96] sm:left-auto sm:right-4 sm:w-[22rem]'
      }
    >
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-300/[0.14] dark:text-emerald-200">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-black text-zinc-950 dark:text-white">{notice.title}</div>
        {notice.body ? <div className="mt-0.5 text-sm font-medium leading-5 text-zinc-500 dark:text-zinc-400">{notice.body}</div> : null}
      </div>
      <IconButton dataId="workspace-action-toast-dismiss" roleName="button" label="Close" onClick={onDismiss}>
        <X className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({ clients: true, projects: true, invoices: true });
  const [inspectorPanel, setInspectorPanel] = useState<InspectorPanel | null>(null);
  const [panelPresentation, setPanelPresentation] = useState<PanelPresentation>('inspector');
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [clientFilter, setClientFilter] = useState<ClientFilter>('all');
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [invoiceFilter, setInvoiceFilter] = useState<InvoiceFilter>('all');
  const [reportRange, setReportRange] = useState<ReportRange>('month');
  const [clientSearch, setClientSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(['task-monthly-close']);
  const [invoiceStatusById, setInvoiceStatusById] = useState<Record<string, InvoiceFilter>>({});
  const copy = useMemo(() => COPY[language], [language]);

  useEffect(() => {
    applyLanguage(language, copy.metaTitle);
  }, [copy.metaTitle, language]);

  useEffect(() => {
    applyTheme(theme);

    if (theme !== 'system') {
      return undefined;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');
    media.addEventListener('change', handleChange);

    return () => media.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setNotice(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const showNotice: ShowNoticeHandler = (title, body) => {
    setNotice({ id: Date.now(), title, body });
  };

  const openPanel: OpenPanelHandler = (panel, noticeTitle, noticeBody, presentation) => {
    const nextPresentation = presentation ?? panel.presentation ?? 'inspector';

    setInspectorPanel(panel);
    setPanelPresentation(nextPresentation);

    if (nextPresentation === 'modal') {
      setNotice(null);
      return;
    }

    showNotice(noticeTitle ?? panel.title, noticeBody ?? localized(language, 'Inspector updated.', 'インスペクターを更新しました。'));
  };

  const openUtilityAction = (title: string, body: string, icon?: LucideIcon, presentation?: PanelPresentation) => {
    openPanel(getUtilityPanel(title, body, copy, language, icon), title, undefined, presentation);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const navigateTab = (tab: TabId) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    showNotice(copy.tabs[tab], localized(language, 'Workspace view changed.', 'ワークスペース画面を切り替えました。'));
  };

  const toggleTask = (taskId: string) => {
    setCompletedTaskIds((current) => {
      if (current.includes(taskId)) {
        showNotice(copy.actions.reopen, localized(language, 'Task returned to the active queue.', 'タスクを未完了に戻しました。'));
        return current.filter((id) => id !== taskId);
      }

      showNotice(copy.actions.complete, localized(language, 'Task marked complete.', 'タスクを完了にしました。'));
      return [...current, taskId];
    });
  };

  const markInvoicePaid = (invoiceId: string) => {
    setInvoiceStatusById((current) => ({
      ...current,
      [invoiceId]: 'paid',
    }));
  };

  const applyGlobalSearch = () => {
    const value = globalSearch.trim();

    if (!value) {
      showNotice(copy.searchLabel, localized(language, 'Enter a search term to filter the current workspace.', '検索語を入力すると現在の画面を絞り込めます。'));
      return;
    }

    if (activeTab === 'clients') {
      setClientSearch(value);
    } else if (activeTab === 'projects') {
      setProjectSearch(value);
    } else if (activeTab === 'invoices') {
      setInvoiceSearch(value);
    }

    openUtilityAction(copy.searchLabel, localized(language, `Search applied: ${value}`, `検索を適用しました: ${value}`), Search);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'clients':
        return (
          <ClientsContent
            copy={copy}
            language={language}
            clientFilter={clientFilter}
            onClientFilterChange={setClientFilter}
            clientSearch={clientSearch}
            onClientSearchChange={setClientSearch}
            onOpenPanel={openPanel}
            onShowNotice={showNotice}
          />
        );
      case 'projects':
        return (
          <ProjectsContent
            copy={copy}
            language={language}
            projectFilter={projectFilter}
            onProjectFilterChange={setProjectFilter}
            projectSearch={projectSearch}
            onProjectSearchChange={setProjectSearch}
            onOpenPanel={openPanel}
            onShowNotice={showNotice}
          />
        );
      case 'invoices':
        return (
          <InvoicesContent
            copy={copy}
            language={language}
            invoiceFilter={invoiceFilter}
            onInvoiceFilterChange={setInvoiceFilter}
            invoiceSearch={invoiceSearch}
            onInvoiceSearchChange={setInvoiceSearch}
            invoiceStatusById={invoiceStatusById}
            onMarkPaid={markInvoicePaid}
            onOpenPanel={openPanel}
            onShowNotice={showNotice}
          />
        );
      case 'reports':
        return (
          <ReportsContent
            copy={copy}
            language={language}
            reportRange={reportRange}
            onReportRangeChange={setReportRange}
            onOpenPanel={openPanel}
            onShowNotice={showNotice}
          />
        );
      case 'overview':
      default:
        return (
          <OverviewContent
            copy={copy}
            language={language}
            completedTaskIds={completedTaskIds}
            onToggleTask={toggleTask}
            onNavigateTab={navigateTab}
            onOpenPanel={openPanel}
          />
        );
    }
  };

  return (
    <AppShell data-melius-ui-id={`${TEMPLATE_ID}-shell`} data-melius-ui-role="app">
      {mobileMenuOpen ? (
        <Overlay data-melius-ui-id="mobile-menu-overlay" data-melius-ui-role="overlay" onClick={() => setMobileMenuOpen(false)}>
          <span className="sr-only">{copy.closeSidebar}</span>
        </Overlay>
      ) : null}
      {mobileMenuOpen ? (
        <MobileDrawer data-melius-ui-id="mobile-sidebar" data-melius-ui-role="navigation">
          <SidebarContent
            copy={copy}
            language={language}
            activeTab={activeTab}
            expandedItems={expandedItems}
            idPrefix="mobile-nav"
            onSelectTab={navigateTab}
            onToggleExpanded={toggleExpanded}
            onUtilityAction={openUtilityAction}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        </MobileDrawer>
      ) : null}

      <WorkspaceFrame data-melius-ui-id="client-billing-workspace" data-melius-ui-role="workspace">
        {sidebarOpen ? (
          <SidebarShell data-melius-ui-id="desktop-sidebar" data-melius-ui-role="navigation">
            <SidebarContent
              copy={copy}
              language={language}
              activeTab={activeTab}
              expandedItems={expandedItems}
              idPrefix="desktop-nav"
              onSelectTab={navigateTab}
              onToggleExpanded={toggleExpanded}
              onUtilityAction={openUtilityAction}
            />
          </SidebarShell>
        ) : null}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <WorkspaceHeader data-melius-ui-id="workspace-header" data-melius-ui-role="header">
            <span className="md:hidden">
              <IconButton dataId="mobile-menu-open" roleName="button" label={copy.openSidebar} onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </span>
            <span className="hidden md:inline-flex">
              <IconButton
                dataId="desktop-sidebar-toggle"
                roleName="button"
                label={copy.collapseSidebar}
                onClick={() => {
                  setSidebarOpen((value) => !value);
                  showNotice(copy.collapseSidebar, localized(language, 'Navigation layout changed.', 'ナビゲーション表示を切り替えました。'));
                }}
              >
                <PanelLeft className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </span>
            <div className="min-w-0 flex-1">
              <h1 data-melius-ui-id="workspace-title" data-melius-ui-role="heading" className="truncate text-lg font-black text-zinc-950 dark:text-white sm:text-xl">
                {copy.appName}<span className="hidden 2xl:inline"> {copy.appSubtitle}</span>
              </h1>
            </div>
            <div className="hidden w-full max-w-sm 2xl:block">
              <SearchInput
                dataId="workspace-global-search"
                roleName="search"
                label={copy.searchLabel}
                type="search"
                placeholder={copy.search}
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    applyGlobalSearch();
                  }
                }}
                icon={<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />}
              />
            </div>
            <ThemeSwitcher copy={copy} theme={theme} onThemeChange={setTheme} />
            <LanguageSwitcher copy={copy} language={language} onLanguageChange={setLanguage} />
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <IconButton dataId="messages-action" roleName="button" label={copy.messages} onClick={() => openUtilityAction(copy.messages, localized(language, 'Messages are grouped by client, invoice, and approval priority.', 'メッセージを顧客、請求、承認優先度で整理しました。'), MessageSquare)}>
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
              </IconButton>
              <span className="relative">
                <IconButton dataId="notifications-action" roleName="button" label={copy.notifications} onClick={() => openUtilityAction(copy.notifications, localized(language, 'Seven billing and delivery alerts need review.', '請求と納品に関する7件の通知があります。'), Bell)}>
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </IconButton>
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-amber-600 text-[10px] font-black text-white dark:bg-amber-500">
                  7
                </span>
              </span>
              <button
                type="button"
                data-melius-ui-id="header-avatar"
                data-melius-ui-role="avatar"
                onClick={() => openUtilityAction(copy.userName, localized(language, 'Profile, approval limits, and workspace permissions are ready to edit.', 'プロフィール、承認上限、ワークスペース権限を編集できます。'), Users)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-zinc-950 bg-gradient-to-br from-zinc-950 to-stone-700 text-xs font-black text-white transition hover:-translate-y-0.5 dark:border-white"
              >
                LD
              </button>
            </div>
          </WorkspaceHeader>

          <main data-melius-ui-id="workspace-main" data-melius-ui-role="main" className="thin-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div
                data-melius-ui-id="workspace-tabs"
                data-melius-ui-role="tabs"
                className="grid w-full grid-cols-5 rounded-lg bg-zinc-950/[0.06] p-1 dark:bg-white/[0.08] lg:max-w-[620px]"
              >
                {tabs.map((tab) => (
                  <TabButton
                    key={tab}
                    dataId={`tab-${tab}`}
                    roleName="tab"
                    selected={activeTab === tab}
                    onClick={() => navigateTab(tab)}
                  >
                    {copy.tabs[tab]}
                  </TabButton>
                ))}
              </div>
              <div data-melius-ui-id="workspace-primary-actions" data-melius-ui-role="actions" className="hidden gap-2 lg:flex">
                <SecondaryButton dataId="collect-payment-action" roleName="button" onClick={() => openUtilityAction(copy.collectPayment, localized(language, 'Payment collection is filtered to waiting and overdue invoices.', '入金待ちと期限超過の請求を回収対象として表示しました。'), Wallet, 'modal')}>
                  <Wallet className="h-4 w-4" aria-hidden="true" />
                  {copy.collectPayment}
                </SecondaryButton>
                <PrimaryButton dataId="new-invoice-action" roleName="button" onClick={() => openUtilityAction(copy.newInvoice, localized(language, 'Invoice setup includes client, project, tax, and due date fields.', '請求作成には顧客、案件、税、支払期限の項目があります。'), Plus, 'modal')}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {copy.newInvoice}
                </PrimaryButton>
              </div>
            </div>
            <div className="content-rise">{renderContent()}</div>
          </main>
        </div>
      </WorkspaceFrame>
      {inspectorPanel && panelPresentation === 'inspector' ? (
        <ActionInspector
          panel={inspectorPanel}
          onClose={() => setInspectorPanel(null)}
          onPrimary={() => showNotice(inspectorPanel.primaryLabel, inspectorPanel.title)}
          onSecondary={() => showNotice(inspectorPanel.secondaryLabel, inspectorPanel.title)}
        />
      ) : null}
      {inspectorPanel && panelPresentation === 'modal' ? (
        <ActionModal
          panel={inspectorPanel}
          onClose={() => setInspectorPanel(null)}
          onPrimary={() => showNotice(inspectorPanel.primaryLabel, inspectorPanel.title)}
          onSecondary={() => showNotice(inspectorPanel.secondaryLabel, inspectorPanel.title)}
        />
      ) : null}
      {notice ? <WorkspaceToast key={notice.id} notice={notice} raised={Boolean(inspectorPanel)} onDismiss={() => setNotice(null)} /> : null}
    </AppShell>
  );
}

export default App;
