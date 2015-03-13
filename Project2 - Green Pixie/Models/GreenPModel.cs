using System.Net;
using Newtonsoft.Json;

namespace Project2___Green_Pixie.Models
{
    public static class GreenPModel
    {
        /// <summary>
        /// JsonString - String that holds the downloaded JSON string from our source
        /// </summary>
        private static string JsonString { get; set; }

        /// <summary>
        /// The Model Object that holds our version of the parsed JsonString
        /// </summary>
        private static GreenPParking ParkingInformation { get; set; }

        /// <summary>
        /// DownloadGreenPParking() - Downloads the GreenP JSON information from the appropriate site
        /// </summary>
        /// <returns>GreenPParking Model class that represents our JsonString</returns>
        private static GreenPParking DownloadGreenPParking()
        {
            //Downloading the JSON String
            using (var downloadClient = new WebClient())
            {
                JsonString =
                    downloadClient.DownloadString(
                        @"http://www1.toronto.ca/City%20Of%20Toronto/Information%20&%20Technology/Open%20Data/Data%20Sets/Assets/Files/greenPParking2015.json");
            }

            //Converting the JSON String
            ParkingInformation = JsonConvert.DeserializeObject<GreenPParking>(JsonString);
            return ParkingInformation;
        }

        /// <summary>
        /// GetGreenPParking() - Public method that returns the Json Model class if it has been previously used
        ///                      or performs the Download of the information and returns that model
        /// </summary>
        /// <returns>GreenPParking Model class representation of our JSON String</returns>
        public static GreenPParking GetGreenPParking()
        {
            return ParkingInformation ?? DownloadGreenPParking();
        }
    }

    //THE BELOW ITEMS REPRESENT THE JSON MODELS/VALUES THAT WE WISH TO KEEP TRACK OF
    #region GreenPModels

    public class GreenPParking
    {
        public ParkingLot[] carparks { get; set; }
    }

    public class ParkingLot
    {
        public string id { get; set; }
        public string address { get; set; }
        public string lat { get; set; }
        public string lng { get; set; }
        public string rate { get; set; }
        public string carpark_type_str { get; set; }
        public bool is_ttc { get; set; }
        public string rate_half_hour { get; set; }
        public string[] payment_methods { get; set; }
        public string[] payment_options { get; set; }
        public RateDetails rate_details { get; set; }
    }

    public class RateDetails
    {
        public LotInformation[] periods { get; set; }
    }

    public class LotInformation
    {
        public string title { get; set; }
        public Rates[] rates { get; set; }
    }

    public class Rates
    {
        public string when { get; set; }
        public string rate { get; set; }
    }

#endregion
}