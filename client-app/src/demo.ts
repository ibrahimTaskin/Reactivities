interface IDuck{
    name:string;
    numLegs:number;
    makeSound?:(sound:string)=>void;
}

const duck1:IDuck={
    name:"huey",
    numLegs:2,
    makeSound:(sound:any)=>console.log(sound)
}
const duck2:IDuck={
    name:"dewey",
    numLegs:2,
    makeSound:(sound:any)=>console.log(sound)
}

duck1.makeSound('quack');
duck2.makeSound(12);