import {
  BookText,
  Briefcase,
  Building,
  Building2,
  CircleHelp,
  CreditCard,
  Dot,
  HandCoins,
  Home,
  IdCard,
  Inbox,
  Layers,
  LayoutDashboard,
  Mail,
  Settings,
  Tag,
  User,
  UserRound,
  Users,
  Package,
  Tags,
  Percent,
  TicketPercent,
  UserCog,
  UserCheck,
  ShoppingCart,
  Store,
  MailIcon,
  BarChart,
  Circle,
  Gift,
  ShoppingBag,
} from "lucide-react";

const renderIcon = (icon: React.ReactNode) => {
  switch (icon) {
    case 'Home':
      return <Home className="w-5 h-5" />;
    case 'Mail':
      return <Mail className="w-5 h-5" />;
    case 'Inbox':
      return <Inbox className="w-5 h-5" />;
    case 'LayoutDashboard':
      return <LayoutDashboard className="w-5 h-5" />;
    case 'LayoutFaq':
      return <CircleHelp className="w-5 h-5" />;
    case 'LayoutTag':
      return <Tag className="w-5 h-5" />;
    case 'LayoutCategory':
      return <Layers className="w-5 h-5" />;
    case 'LayoutMail':
      return <Mail className="w-5 h-5" />;
    case 'LayoutSettings':
      return <Settings className="w-5 h-5" />;
    case 'LayoutBook':
      return <BookText className="w-5 h-5" />;
    case 'LayoutCompany':
      return <Building2 className="w-5 h-5" />;
    case 'LayoutAgentManagement':
    case 'LayoutCompanyManagement':
      return <Building className="w-5 h-5" />;
    case 'LayoutUser':
      return <User className="w-5 h-5" />;
    case 'Dot':
      return <Dot className="w-5 h-5" />;
    case 'Briefcase':
      return <Briefcase className="w-5 h-5" />;
    case 'Users':
      return <Users className="w-5 h-5" />;
    case 'LayoutCommissionManagement':
      return <HandCoins className="w-5 h-5" />;
    case 'LayoutPaymentManagement':
    case 'LayoutIdCard':
      return <IdCard className="w-5 h-5" />;
    case 'LayoutCreditCard':
      return <CreditCard className="w-5 h-5" />;
    case 'LayoutUserRound':
      return <UserRound className="w-5 h-5" />;

    case 'ProductManagement':
      return <Package className="w-5 h-5" />;
    case 'ProductAttributeManagement':
      return <Tags className="w-5 h-5" />;
    case 'VoucherManagement':
      return <TicketPercent className="w-5 h-5" />;
    case 'PromotionManagement':
      return <Percent className="w-5 h-5" />;
    case 'StaffManagement':
      return <UserCog className="w-5 h-5" />;
    case 'CustomerManagement':
      return <UserCheck className="w-5 h-5" />;
    case 'OrderManagement':
      return <ShoppingCart className="w-5 h-5" />;
    case 'POS':
      return <Store className="w-5 h-5" />;
    case 'TemplateEmailManagement':
      return <MailIcon className="w-5 h-5" />;
    case 'StatisticsManagement':
      return <BarChart className="w-5 h-5" />;
    case 'Circle':
      return <Circle className="w-3 h-3" />;
    case 'Gift':
      return <Gift className="w-5 h-5" />;
    case 'ShoppingBag':
      return <ShoppingBag className="w-5 h-5" />;

    default:
      return null;
  }
};

export { renderIcon };

