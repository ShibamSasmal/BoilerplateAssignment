using Ass.Debugging;

namespace Ass
{
    public class AssConsts
    {
        public const string LocalizationSourceName = "Ass";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "1b6faa3461eb4d0e8bfc792ac897ec98";
    }
}
