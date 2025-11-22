//smooth scroll per i link interni, NON TOCCARE ALTRO O SI ROMPE E DEVO SISTEMARLO DI NUOVO PER 2 ORE PERCHE NN SCROLLA
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.main-nav a').forEach(a=>{
    a.addEventListener('click', function(e){
      // Se il link punta a una pagina esterna, non fare nulla
      if(this.getAttribute('href').includes('.html')) {
        return;
      }
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
  
  const quizForm = document.getElementById('quiz-form');
  const answerBox = document.getElementById('quiz-answer');
  if(quizForm && answerBox){
    quizForm.addEventListener('submit', function(e){
      e.preventDefault();

      answerBox.hidden = false;

      const correct = ['Glicogeno','Chitina'];
      const inputs = quizForm.querySelectorAll('input[name="opt"]');
      inputs.forEach(input=>{
        const lbl = input.closest('label');
        if(!lbl) return;

        lbl.classList.remove('correct','incorrect');

        if(correct.includes(input.value)) {
          lbl.classList.add('correct');
        }

        if(input.checked && !correct.includes(input.value)) {
          lbl.classList.add('incorrect');
        }

        input.disabled = true;
      });

      answerBox.scrollIntoView({behavior:'smooth',block:'center'});
    });
  }
});