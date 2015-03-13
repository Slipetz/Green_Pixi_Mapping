using System.Web.Mvc;
using Newtonsoft.Json;
using Project2___Green_Pixie.Models;

namespace Project2___Green_Pixie.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// GetBixieBikeJSON() - GET Route that retrieves the Bixi Bike Information from our models
        /// </summary>
        /// <returns>JSON string of what our parsed model is representative of</returns>
        [HttpGet]
        [Route("~/BixieBike")]
        public string GetBixieBikeJSON()
        {
            return JsonConvert.SerializeObject(BixieBikeModel.GetBixieBikeInformation());
        }

        /// <summary>
        /// GetBixieBikeJSON() - GET Route that retrieves the GreenP Model Information
        /// </summary>
        /// <returns>JSON string of what our parsed model is representative of</returns>
        [HttpGet]
        [Route("~/GreenP")]
        public string GetGreenPJSON()
        {
            return JsonConvert.SerializeObject(GreenPModel.GetGreenPParking());
        }
    }
}