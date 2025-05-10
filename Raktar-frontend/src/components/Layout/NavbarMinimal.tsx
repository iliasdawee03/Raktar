import {useContext, useEffect, useState, useMemo} from "react";
import {rem, Button, useMantineTheme} from "@mantine/core";
import {
    IconUserCircle,
    IconLogout,
    IconHome,
    IconArmchair2,
    IconBasketCheck,
} from "@tabler/icons-react";
import classes from "./NavbarMinimalColored.module.css";
import {useNavigate} from "react-router-dom";
import {useMediaQuery} from "@mantine/hooks";
import useAuth from "../../hooks/useAuth.tsx";
import {AuthContext} from "../../context/AuthContext.tsx";

interface NavbarLinkProps {
    icon: typeof IconHome;
    label: string;
    color: string;
    active?: boolean;

    onClick?(): void;
}

function NavbarLink({icon: Icon, label, color, active, onClick}: NavbarLinkProps) {

    return (
        <div
            role="button"
            className={classes.link} color={color}
            onClick={onClick}
            data-active={active || undefined}
        >
            <Button variant="light" color={color} className={classes.iconButton} style={{width: rem(40), height: rem(40), flexGrow: 0, flexShrink:0, flexBasis: rem(40)}}>
                <Icon className={classes.linkIcon} style={{width: rem(25), height: rem(25), flexGrow: 0, flexShrink:0, flexBasis: rem(25)}} stroke={1.8}/>
            </Button>
            <span>{label}</span>
        </div>
    );
}

export function NavbarMinimal({toggle}: { toggle: () => void }) {
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const [, setActive] = useState(0);
    const navigate = useNavigate();
    const {logout} = useAuth();
    const {role} = useContext(AuthContext);

    const menuItems = useMemo(() => [
        {
            icon: IconHome,
            label: "Kezdőlap",
            url: "/dashboard",
            roles: ['Customer', 'Supplier', 'Carrier', 'WarehouseStaff', 'Admin'],
        },
        {
            icon: IconArmchair2,
            label : "Termékek",
            url: "/dashboard/product", 
            roles : ['Customer', 'Admin'],
        },
        {
            icon: IconBasketCheck,
            label : "Rendelések",
            url: "/dashboard/supplierorders",
            roles : ['Admin','Supplier'],
        },
    ], []);


    const onLogout = () => {
        logout();
    }

    useEffect(() => {
        setActive(menuItems.findIndex(m => location.pathname === m.url));
    }, [menuItems])

    const links = menuItems.filter(item => item.roles.includes(role ?? ''))
        .map((link) => (
            <NavbarLink
                color="app-color"
                {...link}
                key={link.label}
                active={location.pathname === link.url}
                onClick={async () => {
                    toggle();
                    navigate(link.url);
                }}
            />
        ));

        return (
            <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                    {links}
                </div>
                <div className={classes.footer} style={{
                    width: !isMobile ? '216px' : '90%',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    backgroundColor: 'var(--mantine-color-body)',
                    zIndex: 1000,
                    padding: 'var(--mantine-spacing-md)',
                }}>
                    <NavbarLink
                        active={location.pathname === '/profile'}
                        icon={IconUserCircle}
                        label="Profil"
                        onClick={() => {
                            navigate('/dashboard/profile');
                            toggle();
                        }} 
                        color="grape" 
                    />
                    <NavbarLink
                        icon={IconLogout}
                        label="Kijelentkezés"
                        onClick={onLogout} 
                        color="grape"
                    />
                </div>
            </nav>
        );
}