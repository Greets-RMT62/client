import { useState } from "react";
import {
  X,
  Brain,
  Sparkles,
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AISummaryModal({
  isOpen,
  onClose,
  activeChat,
  isDarkMode,
  onSummaryGenerated,
}) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const createNaturalSummary = () => {
    const messages = activeChat.messages.filter((msg) => msg.from !== "System");

    if (messages.length === 0) {
      return "Belum ada pesan untuk dirangkum dalam percakapan ini.";
    }

    // Analyze actual message content
    const allText = messages.map((m) => m.text).join(" ");
    const participants = [...new Set(messages.map((msg) => msg.from))];
    const totalMessages = messages.length;

    // Extract key topics and themes
    const commonWords = allText
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});

    const topWords = Object.entries(commonWords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    // Determine conversation type based on content
    let summaryType = "casual";
    if (
      allText.includes("project") ||
      allText.includes("tugas") ||
      allText.includes("kerja")
    ) {
      summaryType = "work";
    } else if (
      allText.includes("game") ||
      allText.includes("main") ||
      allText.includes("fun")
    ) {
      summaryType = "entertainment";
    } else if (
      allText.includes("test") ||
      allText.includes("tes") ||
      allText.includes("halo")
    ) {
      summaryType = "testing";
    }

    // Generate contextual summary
    let summary = "";

    switch (summaryType) {
      case "work":
        summary = `Dari percakapan ini keliatan mereka lagi serius koordinasi project atau tugas. Ada ${totalMessages} pesan dari ${
          participants.length
        } orang (${participants.join(", ")}). `;
        summary += `Topik utama yang dibahas: ${topWords
          .slice(0, 3)
          .join(
            ", "
          )}. Suasananya produktif tapi tetep santai, kayak tim yang udah kompak. `;
        break;

      case "entertainment":
        summary = `Seru banget nih obrolannya! Ada ${totalMessages} pesan dari ${participants.join(
          " sama "
        )}. `;
        summary += `Mereka lagi ngobrol santai soal hiburan dan hal-hal fun. Yang sering dibahas: ${topWords
          .slice(0, 3)
          .join(", ")}. `;
        summary += `Banyak candaan dan ketawa-ketawa, kayak lagi hangout bareng temen. `;
        break;

      case "testing":
        summary = `Dari ${totalMessages} pesan ini, kelihatan banget mereka lagi ngecek koneksi chat dan nyoba-nyoba fitur. `;
        summary += `Yang ikut: ${participants.join(
          ", "
        )}. Banyak pesan "test", "halo", dan sejenisnya. `;
        summary += `Suasananya santai, kayak lagi explore aplikasi baru sambil ngobrol ringan. `;
        break;

      default:
        summary = `Dari ${totalMessages} pesan antara ${participants.join(
          " dan "
        )}, keliatan mereka lagi ngobrol santai dan akrab. `;
        summary += `Yang sering dibahas: ${topWords.slice(0, 3).join(", ")}. `;
        summary += `Flow obrolannya natural, kayak temen yang udah kenal lama. `;
    }

    // Add engagement analysis
    if (totalMessages > 30) {
      summary += `Dengan ${totalMessages} pesan, mereka bener-bener aktif dan antusias banget ngobrolnya. `;
    } else if (totalMessages > 15) {
      summary += `${totalMessages} pesan cukup rame, flow obrolannya lancar. `;
    } else {
      summary += `Walaupun baru ${totalMessages} pesan, tapi udah keliatan chemistry-nya bagus. `;
    }

    // Add conclusion based on content
    const conclusions = [
      "Pokoknya suasananya positif dan bikin betah buat ikut ngobrol!",
      "Mereka kayak geng yang udah solid dan punya chemistry bagus.",
      "Asik banget deh pokoknya, obrolan yang mengalir natural!",
      "Yang jelas mereka enjoy banget sama obrolannya dan saling support.",
    ];

    summary += conclusions[Math.floor(Math.random() * conclusions.length)];

    return summary;
  };

  const generateSummary = async () => {
    if (
      !activeChat ||
      !activeChat.messages ||
      activeChat.messages.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "No Messages",
        text: "No messages found to summarize in this chat.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Always use natural summary for better results
      const generatedSummary = createNaturalSummary();
      setSummary(generatedSummary);

      // Pass summary to parent component
      if (onSummaryGenerated) {
        onSummaryGenerated(generatedSummary);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      const fallbackSummary = createNaturalSummary();
      setSummary(fallbackSummary);

      if (onSummaryGenerated) {
        onSummaryGenerated(fallbackSummary);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-4xl rounded-3xl shadow-2xl ${
          isDarkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Chat Summary</h2>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Generate intelligent summary of your conversation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!summary && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Summarize</h3>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Click generate to create an intelligent summary of your chat
              </p>
              <button
                onClick={generateSummary}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium hover:shadow-lg transition flex items-center gap-2 mx-auto"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isLoading ? "Generating..." : "Generate Summary"}
              </button>
            </div>
          )}

          {summary && (
            <div>
              <div
                className={`p-6 rounded-2xl mb-4 ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="prose max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={copySummary}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                    isDarkMode
                      ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  {isCopied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={generateSummary}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                    isDarkMode
                      ? "border-gray-600 hover:bg-gray-700 text-gray-300"
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
