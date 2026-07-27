
const PLATES_PER_PAGE = 10;

const generateBtn = document.getElementById("generateBtn");
const pdfBtn = document.getElementById("pdfBtn");
const input = document.getElementById("nameInput");
const preview = document.getElementById("previewArea");



function fitText(element, minSize = 16){

    // CSS에 지정된 현재 글자 크기를 시작값으로 사용
    let size = parseFloat(window.getComputedStyle(element).fontSize);

    // 부모 요소 안에서 사용할 수 있는 실제 폭
    const maxWidth = element.parentElement.clientWidth - 24;

    while (element.scrollWidth > maxWidth && size > minSize) {

        size--;

        element.style.fontSize = size + "px";

    }

}

// =============================
// 이름 영문 (임시)
// =============================

function parseInput(line){

    const parts = line
    .split(/[,\t]+/)
    .map(v => v.trim())
    .filter(v => v !== "");

    if(parts.length !== 3){

        alert(
            "입력 형식은\n김민수,KIM,MINSOO\n형식으로 입력해주세요."
        );

        return null;
    }

    return{

        korean: parts[0],

        surnameEng: parts[1].toUpperCase(),

        givenEng: parts[2].toUpperCase()

    };

}

// =============================
// 이름표 생성
// =============================

function createPlate(line){

    const info = parseInput(line);

    if(!info) return null;

    const plate = document.createElement("div");
    

    plate.className="nameplate";

    plate.innerHTML=`

        <img class="template" src="assets/template.png">

        <div class="topSurname">

            ${info.surnameEng}

        </div>

        <div class="firstName">

            ${info.givenEng}

        </div>

        <div class="divide"></div>

        <div class="korean">

            ${info.korean}

        </div>

    `;
    // 영어 성
    fitText(plate.querySelector(".topSurname"), 16);
    // 영어 이름
    fitText(plate.querySelector(".firstName"), 20);
    // 한국 이름
    fitText(plate.querySelector(".korean"), 22);
    return plate;

}

// =============================
// 이름표 생성 버튼
// =============================

generateBtn.addEventListener("click",()=>{

    preview.innerHTML="";

    const names = input.value

        .split("\n")

        .map(v=>v.trim())

        .filter(v=>v!="");

    if(names.length===0){

        alert("이름을 입력하세요.");

        return;

    }

    let page;

    names.forEach((name,index)=>{

        if(index % PLATES_PER_PAGE===0){

            page=document.createElement("div");

            page.className="a4-page";

            preview.appendChild(page);

        }

        const plate = createPlate(name);

        if(plate){

            page.appendChild(plate);

        }

    });

});

// =============================
// PDF 저장
// =============================

pdfBtn.addEventListener("click",async()=>{

    const pages=document.querySelectorAll(".a4-page");

    if(pages.length===0){

        alert("먼저 이름표를 생성하세요.");

        return;

    }

    const { jsPDF } = window.jspdf;

    const pdf=new jsPDF({

        orientation:"portrait",

        unit:"mm",

        format:"a4"

    });

    for(let i=0;i<pages.length;i++){

        const canvas = await html2canvas(

            pages[i],

            {

                scale:3,

                backgroundColor:"#ffffff",

                useCORS:true

            }

        );

        const img=canvas.toDataURL("image/png");

        if(i>0){

            pdf.addPage();

        }

        pdf.addImage(

            img,

            "PNG",

            0,

            0,

            210,

            297

        );

    }

    pdf.save("NamePlate.pdf");

});