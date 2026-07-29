import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode
} from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarRange,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileHeart,
  FileText,
  HeartHandshake,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareHeart,
  PanelLeftClose,
  PanelLeftOpen,
  Pill,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserRound,
  UsersRound,
  Video,
  X
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { DEMO_MODE } from "../api/demo";
import { Brand, Button } from "./ui";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

const patientNav: NavItem[] = [
  { label: "Overview", to: "/patient/dashboard", icon: <Home /> },
  { label: "Find a doctor", to: "/patient/doctors", icon: <Stethoscope /> },
  { label: "Appointments", to: "/patient/appointments", icon: <CalendarDays /> },
  { label: "Mood check", to: "/patient/mood-check", icon: <MessageSquareHeart /> },
  { label: "Resources", to: "/patient/resources", icon: <BookOpen /> },
  { label: "Prescriptions", to: "/patient/prescriptions", icon: <Pill /> }
];

const doctorNav: NavItem[] = [
  { label: "Overview", to: "/doctor/dashboard", icon: <LayoutDashboard /> },
  { label: "Requests", to: "/doctor/requests", icon: <ClipboardCheck /> },
  { label: "Appointments", to: "/doctor/appointments", icon: <CalendarDays /> },
  { label: "Availability", to: "/doctor/availability", icon: <CalendarRange /> },
  {
    label: "Exceptions",
    to: "/doctor/schedule-exceptions",
    icon: <Activity />
  },
  { label: "Consultations", to: "/doctor/consultations", icon: <FileHeart /> },
  { label: "Prescriptions", to: "/doctor/prescriptions", icon: <Pill /> }
];

const adminNav: NavItem[] = [
  { label: "Overview", to: "/admin/dashboard", icon: <LayoutDashboard /> },
  { label: "Doctor approvals", to: "/admin/doctors?status=Pending", icon: <ShieldCheck /> },
  { label: "Patients", to: "/admin/patients", icon: <UserRound /> },
  { label: "Doctors", to: "/admin/doctors", icon: <Stethoscope /> },
  { label: "Appointments", to: "/admin/appointments", icon: <CalendarDays /> },
  { label: "Consultations", to: "/admin/consultations", icon: <FileHeart /> },
  { label: "Prescriptions", to: "/admin/prescriptions", icon: <Pill /> },
  { label: "Consent records", to: "/admin/consents", icon: <ClipboardList /> },
  { label: "Audit timeline", to: "/admin/audit", icon: <Activity /> },
  { label: "Teleconsults", to: "/admin/teleconsults", icon: <Video /> },
  { label: "Schedule exceptions", to: "/admin/schedule-exceptions", icon: <CalendarRange /> }
];

export function Sidebar({
  items,
  open,
  collapsed,
  dragOffset,
  isDragging,
  onClose,
  onToggle,
  portal
}: {
  items: NavItem[];
  open: boolean;
  collapsed: boolean;
  dragOffset: number;
  isDragging: boolean;
  onClose(): void;
  onToggle(): void;
  portal: "patient" | "doctor" | "admin";
}) {
  const { logout } = useAuth();
  const location = useLocation();
  const isItemActive = (item: NavItem) => {
    const [pathname, query = ""] = item.to.split("?");
    const queryParams = new URLSearchParams(query);
    const currentParams = new URLSearchParams(location.search);
    const pathMatches =
      location.pathname === pathname ||
      location.pathname.startsWith(`${pathname}/`);

    if (!pathMatches) return false;
    if (queryParams.size > 0) {
      return Array.from(queryParams.entries()).every(
        ([key, value]) => currentParams.get(key) === value
      );
    }

    return !(
      portal === "admin" &&
      pathname === "/admin/doctors" &&
      currentParams.get("status") === "Pending"
    );
  };

  return (
    <>
      {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Close navigation" />}
      <aside
        id={`${portal}-navigation`}
        className={`sidebar sidebar-${portal} ${open ? "is-open" : ""} ${
          isDragging ? "is-dragging" : ""
        }`}
        aria-label={`${portal} portal navigation`}
        style={{ "--sidebar-drag": `${dragOffset}px` } as CSSProperties}
      >
        <div className="sidebar-head">
          <Brand />
          <button
            className="icon-button sidebar-collapse"
            onClick={onToggle}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            aria-expanded={!collapsed}
            aria-controls={`${portal}-navigation`}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </button>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation">
            <X />
          </button>
        </div>
        <p className="portal-label">{portal} portal</p>
        <nav aria-label={`${portal} navigation`}>
          {items.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          {portal === "patient" && (
            <Link className="support-link" to="/patient/safety">
              <HeartHandshake />
              <span>
                <strong>Need urgent help?</strong>
                <small>Open safety support</small>
              </span>
            </Link>
          )}
          <button onClick={() => void logout()} className="logout-link">
            <LogOut />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export function Topbar({
  portal,
  onMenu
}: {
  portal: "patient" | "doctor" | "admin";
  onMenu(): void;
}) {
  const auth = useAuth();
  const location = useLocation();
  const section = location.pathname.split("/").filter(Boolean).pop() || "dashboard";
  const profilePath = `/${portal}/profile`;
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button menu-button" onClick={onMenu} aria-label="Open navigation">
          <Menu />
        </button>
        <div>
          <span className="topbar-context">
            {portal} workspace
            {DEMO_MODE && <i className="demo-mode-badge">Frontend demo</i>}
          </span>
          <strong>{section.replaceAll("-", " ")}</strong>
        </div>
      </div>
      <label className="top-search">
        <span className="sr-only">Search workspace</span>
        <Search aria-hidden="true" />
        <input type="search" placeholder={`Search ${portal} workspace`} />
        <kbd>⌘ K</kbd>
      </label>
      <div className="topbar-actions">
        <button className="icon-button notification-button" aria-label="Notifications">
          <Bell />
          <span aria-label="2 unread notifications">2</span>
        </button>
        <Link className="profile-menu" to={profilePath}>
          <span className="avatar avatar-small">
            {auth.fullName?.charAt(0).toUpperCase() || "S"}
          </span>
          <span>
            <strong>{auth.fullName || auth.username}</strong>
            <small>{portal === "admin" ? "Administrator" : portal}</small>
          </span>
          <ChevronDown />
        </Link>
      </div>
    </header>
  );
}

function PortalShell({
  portal,
  items
}: {
  portal: "patient" | "doctor" | "admin";
  items: NavItem[];
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const gesture = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    currentX: number;
    wasOpen: boolean;
    direction?: "horizontal" | "vertical";
  } | undefined>(undefined);
  const didDrag = useRef(false);
  const location = useLocation();

  const isDrawerViewport = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches;

  const resetDrag = () => {
    gesture.current = undefined;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "touch" ||
      !isDrawerViewport() ||
      (!navOpen && event.clientX > 28)
    ) {
      return;
    }

    didDrag.current = false;
    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      wasOpen: navOpen
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const currentGesture = gesture.current;
    if (!currentGesture || currentGesture.pointerId !== event.pointerId) return;

    const horizontalDistance = event.clientX - currentGesture.startX;
    const verticalDistance = event.clientY - currentGesture.startY;
    if (!currentGesture.direction) {
      if (Math.abs(verticalDistance) > Math.abs(horizontalDistance) && Math.abs(verticalDistance) > 8) {
        gesture.current = undefined;
        return;
      }
      if (Math.abs(horizontalDistance) < 8) return;
      currentGesture.direction = "horizontal";
      didDrag.current = true;
      setIsDragging(true);
    }

    currentGesture.currentX = event.clientX;
    const offset = currentGesture.wasOpen
      ? Math.min(0, Math.max(-320, horizontalDistance))
      : Math.max(0, Math.min(320, horizontalDistance));
    setDragOffset(offset);
  };

  const settleDrawer = (event: PointerEvent<HTMLDivElement>) => {
    const currentGesture = gesture.current;
    if (!currentGesture || currentGesture.pointerId !== event.pointerId) return;

    const distance = currentGesture.currentX - currentGesture.startX;
    if (currentGesture.direction === "horizontal") {
      const shouldOpen = currentGesture.wasOpen ? distance > -84 : distance > 84;
      setNavOpen(shouldOpen);
      window.setTimeout(() => {
        didDrag.current = false;
      }, 0);
    }
    resetDrag();
  };

  useEffect(() => {
    setNavOpen(false);
    resetDrag();
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!navOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [navOpen]);

  return (
    <div
      className={`app-shell app-shell-${portal} ${
        navCollapsed ? "is-sidebar-collapsed" : ""
      } ${isDragging ? "is-sidebar-dragging" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={settleDrawer}
      onPointerCancel={settleDrawer}
      onClickCapture={(event) => {
        if (!didDrag.current) return;
        event.preventDefault();
        event.stopPropagation();
        didDrag.current = false;
      }}
    >
      <Sidebar
        items={items}
        open={navOpen}
        collapsed={navCollapsed}
        dragOffset={dragOffset}
        isDragging={isDragging}
        onClose={() => {
          setNavOpen(false);
          resetDrag();
        }}
        onToggle={() => setNavCollapsed((current) => !current)}
        portal={portal}
      />
      <div className="app-main">
        <Topbar portal={portal} onMenu={() => setNavOpen((current) => !current)} />
        <main id="main-content" className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="app-shell-generic">{children}</div>;
}

export function PatientShell() {
  return <PortalShell portal="patient" items={patientNav} />;
}
export const PatientLayout = PatientShell;

export function DoctorShell() {
  return <PortalShell portal="doctor" items={doctorNav} />;
}
export const DoctorLayout = DoctorShell;

export function AdminShell() {
  return <PortalShell portal="admin" items={adminNav} />;
}
export const AdminLayout = AdminShell;

export function UtilityLinks({ portal }: { portal: "patient" | "doctor" }) {
  return (
    <div className="utility-links">
      <Link to={`/${portal}/profile`}>
        <UserRound /> Profile
      </Link>
      {portal === "patient" && (
        <Link to="/patient/payment-methods">
          <CreditCard /> Payments
        </Link>
      )}
      <Link to={`/${portal}/settings`}>
        <Settings /> Settings
      </Link>
      {portal === "patient" && (
        <Link to="/patient/help">
          <CircleHelp /> Help
        </Link>
      )}
    </div>
  );
}
