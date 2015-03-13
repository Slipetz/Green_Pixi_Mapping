using System.Net;
using Newtonsoft.Json;

namespace Project2___Green_Pixie.Models
{
    public static class BixieBikeModel
    {
        /// <summary>
        /// JsonString - String that holds the downloaded JSON string from our source
        /// </summary>
        private static string JsonString { get; set; }

        /// <summary>
        /// The Model Object that holds our version of the parsed JsonString
        /// </summary>
        private static BixieBike BixieBikeInformation { get; set; }

        /// <summary>
        /// DownloadBixieInformation - Downloads the Bixi Bike JSON information from the appropriate site
        /// </summary>
        /// <returns>BixieBike Model class that represents our JsonString</returns>
        private static BixieBike DownloadBixieInformation()
        {
            //Download the JSON and store it
            using (var downloadClient = new WebClient())
            {
                JsonString = downloadClient.DownloadString(@"http://www.bikesharetoronto.com/stations/json");
            }

            //Convert/Deserialize the JSON into the proper format
            BixieBikeInformation = JsonConvert.DeserializeObject<BixieBike>(JsonString);
            return BixieBikeInformation;
        }

        /// <summary>
        /// GetBixieBikeInformation() - Public method that returns the Json Model class if it has been previously used
        ///                             or performs the Download of the information and returns that model
        /// </summary>
        /// <returns>BixieBike Model class representation of our JSON String</returns>
        public static BixieBike GetBixieBikeInformation()
        {
            return BixieBikeInformation ?? DownloadBixieInformation();
        }
    }

    //THE BELOW ITEMS REPRESENT THE JSON MODELS/VALUES THAT WE WISH TO KEEP TRACK OF
    #region BixiModels
    public class BixieBike
    {
        public string executionTime { get; set; }
        public Station[] stationBeanList { get; set; }
    }

    public class Station
    {
        public string id { get; set; }
        public string stationName { get; set; }
        public string availableDocks { get; set; }
        public string totalDocks { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string statusValue { get; set; }
        public string availableBikes { get; set; }
    }
    //THE BELOW ITEMS REPRESENT THE JSON MODELS/VALUES THAT WE WISH TO KEEP TRACK OF
    #endregion
}