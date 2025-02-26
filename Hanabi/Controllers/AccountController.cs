using System.Security.Authentication;
using Hanabi.Models;
using Hanabi.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hanabi.Controllers;

[Route("/")]
public class AccountController : Controller {

    public AccountController(AccountService accountService) {
        AccountService = accountService;
    }

    private AccountService AccountService { get; }

    [HttpPost]
    [Route("/token")]
    public IActionResult Token([FromBody] AuthenticationModel model) {
        try {
            return Json(AccountService.Authenticate(model));
        }
        catch(AuthenticationException) {
            return BadRequest();
        }
    }
}