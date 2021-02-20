using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        // Geriye değer dönmeyeceği için IRequest bir parametre içermez.
        // Command geriye değer dönmez. O yüzden Unit aldık.
        // Unit,MediatR'dan gelir. Geriye değer dönmez.
        public class Command : IRequest<Result<Unit>> 
        {
            public Activity Activity { get; set; }
        }


        // Fluent Validation Middleware
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x=>x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context= context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Inmemory
                 _context.Activities.Add(request.Activity);

                 // Eğer kayıt edimiyorsa result false,ediyorsa true gelir.
                var result= await _context.SaveChangesAsync() >0;

                if (!result) return Result<Unit>.Failure("Failed to Create Activity!");

                // Task Unit tipinde olduğu için birşey geriye dönmek zorunda.
                // Fakat Add işlemiyle bir alakası yok.
                 return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}