import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

export type PageView = 'dashboard' | 'usuarios' | 'quartos' | 'reservas';

const mainListItems: { text: string; icon: React.ReactNode; page: PageView }[] = [
  { text: 'Dashboard', icon: <DashboardRoundedIcon />, page: 'dashboard' },
  { text: 'Usuários', icon: <PeopleRoundedIcon />, page: 'usuarios' },
  { text: 'Quartos', icon: <MeetingRoomRoundedIcon />, page: 'quartos' },
  { text: 'Reservas', icon: <EventNoteRoundedIcon />, page: 'reservas' },
];

const secondaryListItems = [
  { text: 'Configurações', icon: <SettingsRoundedIcon /> },
  { text: 'Ajuda', icon: <HelpRoundedIcon /> },
];

interface MenuContentProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export default function MenuContent({ currentPage, onNavigate }: MenuContentProps) {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <Stack spacing={0.5}>
        <Typography
          variant="caption"
          sx={{ px: 1.5, py: 1, color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}
        >
          Menu
        </Typography>
        <List dense>
          {mainListItems.map((item) => (
            <ListItem key={item.page} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={currentPage === item.page}
                onClick={() => onNavigate(item.page)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    '&:hover': { backgroundColor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>

      <Stack spacing={0.5}>
        <Divider sx={{ mb: 1 }} />
        <List dense>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Stack>
  );
}