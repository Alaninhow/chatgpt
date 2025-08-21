const theme = {
  colors: {
    background: '#0F172A',
    bg: '#0F172A', // alias de compatibilidade
    primary: '#3B82F6',
    text: '#F9FAFB',
    muted: '#9CA3AF',
    card: '#1F2937',
    border: '#334155',
    danger: '#EF4444',
    success: '#10B981',
  },
  spacing: (n) => n * 8,
  radius: { sm: 8, md: 12, lg: 20, xl: 28 },
  typography: { title: 22, subtitle: 18, body: 16, small: 14 },
};
export default theme;
export const COLORS = theme.colors;
