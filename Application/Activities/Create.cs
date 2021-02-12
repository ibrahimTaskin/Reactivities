using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        // Geriye değer dönmeyeceği için IRequest bir parametre içermez.
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context= context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // Inmemory
                 _context.Activities.Add(request.Activity);
                 await _context.SaveChangesAsync();

                // Task Unit tipinde olduğu için birşey geriye dönmek zorunda.
                // Fakat Add işlemiyle bir alakası yok.
                 return Unit.Value;
            }
        }
    }
}