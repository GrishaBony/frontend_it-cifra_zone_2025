const isDark = usePreferredDark()

export const useThemeStore = defineStore('theme', () => {
    const colorScheme = ref<'light' | 'dark'>('dark');
    const backgroundColor = ref<string>('#000000');

    const setTheme: any = (newTheme: any) => {
        if (useUserStore().isTg) {
            colorScheme.value = newTheme.colorScheme.value;
            backgroundColor.value = newTheme.backgroundColor.value;
        } else {
            colorScheme.value = isDark.value ? 'dark' : 'light'
            backgroundColor.value = isDark.value ? '#181818' : '#ffffff'
        }
        
        const root = document.documentElement
        colorScheme.value === 'dark' 
            ? root.classList.add('dark') 
            : root.classList.remove('dark');
    };

    return { colorScheme, backgroundColor, setTheme };
})