using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjetoCadastro.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjetoCadastro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly Contexto _contexto;

        public UsuariosController(Contexto contexto)
        {
            _contexto = contexto;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> PegarTodos()
        {
            return await _contexto.Usuarios.Include("Sexo").ToListAsync();
        }
        [HttpGet("{UsuarioId}")]
        public async Task<ActionResult<Usuario>> PegarUsuarioPeloId(int usuarioId)
        {
            Usuario usuario = await _contexto.Usuarios.Include("Sexo").FirstOrDefaultAsync(x=>x.UsuarioId == usuarioId);
            if (usuario == null)
                return NotFound();
            return usuario;
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> SalvarUsuario(Usuario usuario)
        {
            await _contexto.Usuarios.AddAsync(usuario);
            await _contexto.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> AtualizarUsuario(Usuario usuario)
        {
            _contexto.Usuarios.Update(usuario);
            await _contexto.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{usuarioId}")]
        public async Task<ActionResult> DeletarUsuario(int usuarioId)
        {
            Usuario usuario = await _contexto.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
                return NotFound();
            _contexto.Remove(usuario);
            await _contexto.SaveChangesAsync();

            return Ok();
        }
  
    }
}
