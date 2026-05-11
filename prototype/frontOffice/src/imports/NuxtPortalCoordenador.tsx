import svgPaths from "./svg-76soc3xan1";
import imgButton from "figma:asset/db135b6708f6cc7f72f27c6a31dd02aa5500d030.png";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px] text-center">Voltar</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-[289.5px] top-[97px] w-[65.656px]" data-name="Button">
      <Icon />
      <Text />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:SemiBold',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[16px]">Prestação de Contas Técnica</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#94a3b8] text-[16px]">Este relatório técnico deve informar os resultados do projeto, metas alcançadas e atividades cumpridas.</p>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[60px] items-start left-[289.5px] top-[141px] w-[1024px]" data-name="Header">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function PrimitiveDiv() {
  return <div className="absolute bg-[#404040] h-px left-[289.5px] top-[233px] w-[1024px]" data-name="Primitive.div" />;
}

function Text1() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[117.3px] top-0 w-[7.063px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fb2c36] text-[14px]">*</p>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[20px] left-0 not-italic text-[#fafafa] text-[14px] top-0">Palavras-chave</p>
      <Text1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#94a3b8] text-[14px]">Indique de três a cinco palavras-chave que identificam a pesquisa</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-[#171717] h-[38px] relative rounded-[6px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Ex: Educação, Tecnologia, Inovação</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[94px] items-start left-0 top-0 w-[1024px]" data-name="Container">
      <Label />
      <Paragraph2 />
      <TextInput />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[300.56px] top-0 w-[7.063px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fb2c36] text-[14px]">*</p>
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[20px] left-0 not-italic text-[#fafafa] text-[14px] top-0">Resumo para Publicação no site da Fapes</p>
      <Text2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#94a3b8] text-[14px]">Descreva de forma objetiva, com mínimo de 250 e máximo de 500 palavras.</p>
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-[#171717] h-[138px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[12px] py-[8px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Digite aqui</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[231px]">Máximo de 500 palavras (0/500)</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[229px] items-start left-0 top-[118px] w-[1024px]" data-name="Container">
      <Label1 />
      <Paragraph3 />
      <TextArea />
      <Paragraph4 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute content-stretch flex h-[23px] items-start left-[169.89px] top-0 w-[8.078px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#fb2c36] text-[16px]">*</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] left-0 not-italic text-[#fafafa] text-[16px] top-0">Descrição do Projeto</p>
      <Text3 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Introdução</p>
    </div>
  );
}

function TextArea1() {
  return (
    <div className="bg-[#171717] h-[138px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[12px] py-[8px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Digite aqui</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[250px]">Máximo de 2.000 palavras (0/2000)</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[201px] items-start relative shrink-0 w-full" data-name="Container">
      <Label2 />
      <TextArea1 />
      <Paragraph5 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Objetivos Propostos</p>
    </div>
  );
}

function TextArea2() {
  return (
    <div className="bg-[#171717] h-[138px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[12px] py-[8px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Digite aqui</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[231px]">Máximo de 500 palavras (0/500)</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[201px] items-start relative shrink-0 w-full" data-name="Container">
      <Label3 />
      <TextArea2 />
      <Paragraph6 />
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Metodologia</p>
    </div>
  );
}

function TextArea3() {
  return (
    <div className="bg-[#171717] h-[138px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[12px] py-[8px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Digite aqui</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[231px]">Máximo de 500 palavras (0/500)</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[201px] items-start relative shrink-0 w-full" data-name="Container">
      <Label4 />
      <TextArea3 />
      <Paragraph7 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[675px] items-start left-0 top-[371px] w-[1024px]" data-name="Container">
      <Heading />
      <Container2 />
      <Container3 />
      <Container4 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[16px]">Objetivos Alcançados</p>
    </div>
  );
}

function Label5() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Até o momento, os objetivos da pesquisa foram atingidos?</p>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="h-[20px] relative shrink-0 w-[153.234px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px] text-center">Selecione uma opção</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <PrimitiveSpan />
          <Icon1 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Label5 />
      <PrimitiveButton />
    </div>
  );
}

function Label6() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Justifique</p>
    </div>
  );
}

function TextArea4() {
  return (
    <div className="bg-[#171717] h-[138px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[12px] py-[8px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Digite aqui</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[230px]">Máximo de 250 palavras (0/250)</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[201px] items-start relative shrink-0 w-full" data-name="Container">
      <Label6 />
      <TextArea4 />
      <Paragraph8 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[321px] items-start left-0 top-[1070px] w-[1024px]" data-name="Container">
      <Heading1 />
      <Container6 />
      <Container7 />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="absolute bg-[#404040] h-px left-0 top-[1423px] w-[1024px]" data-name="Primitive.div" />;
}

function Text4() {
  return (
    <div className="absolute content-stretch flex h-[23px] items-start left-[184.25px] top-0 w-[8.078px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#fb2c36] text-[16px]">*</p>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] left-0 not-italic text-[#fafafa] text-[16px] top-0">Equipe Técnica Efetiva</p>
      <Text4 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Equipe de Execução</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Indicar as pessoas envolvidas na pesquisa. Informar nome completo, nome da Instituição que pertence e se participou, de fato, da pesquisa.</p>
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute content-stretch flex h-[44.5px] items-start left-0 px-[8px] py-[12px] top-0 w-[476.25px]" data-name="Header Cell">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Membros</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute content-stretch flex h-[44.5px] items-start left-[476.25px] px-[8px] py-[12px] top-0 w-[219.672px]" data-name="Header Cell">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Instituição</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute content-stretch flex h-[44.5px] items-start left-[695.92px] px-[8px] py-[12px] top-0 w-[328.078px]" data-name="Header Cell">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Participação</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute border-[#404040] border-b border-solid h-[44.5px] left-0 top-0 w-[1024px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute h-[44.5px] left-0 top-0 w-[1024px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[45px] left-0 top-0 w-[476.25px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#fafafa] text-[14px] top-[12.5px]">Paulo Sérgio Souza Junior</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[45px] left-[476.25px] top-0 w-[219.672px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#fafafa] text-[14px] top-[12.5px]">Ifes</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text5 />
        <RadioButton />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton1() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text6 />
        <RadioButton1 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[20px] items-center left-[8px] top-[12.5px] w-[312.078px]" data-name="Container">
      <Label7 />
      <Label8 />
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[45px] left-[695.92px] top-0 w-[328.078px]" data-name="Table Cell">
      <Container9 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#404040] border-b border-solid h-[45px] left-0 top-0 w-[1024px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[45px] left-0 top-[44.5px] w-[1024px]" data-name="Table Body">
      <TableRow1 />
    </div>
  );
}

function Table() {
  return (
    <div className="h-[90px] overflow-clip relative shrink-0 w-full" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Houve mudanças na Equipe de Execução?</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton2() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text7 />
        <RadioButton2 />
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton3() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text8 />
        <RadioButton3 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Label9 />
      <Label10 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph11 />
      <Container10 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[278px] items-start left-0 top-[1456px] w-[1024px]" data-name="Container">
      <Heading2 />
      <Paragraph9 />
      <Paragraph10 />
      <Table />
      <Container11 />
    </div>
  );
}

function PrimitiveDiv2() {
  return <div className="absolute bg-[#404040] h-px left-0 top-[1766px] w-[1024px]" data-name="Primitive.div" />;
}

function Heading3() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[16px]">Indicadores de Produção</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#94a3b8] text-[14px]">Indicar apenas a produção gerada a partir da pesquisa. Se houver, enviar o link ou anexar a o PDF da publicação</p>
    </div>
  );
}

function Label11() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Produção Bibliográfica</p>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[153.234px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px] text-center">Selecione uma opção</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <PrimitiveSpan1 />
          <Icon2 />
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Label11 />
      <PrimitiveButton1 />
    </div>
  );
}

function Label12() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Produção Cultural</p>
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[153.234px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px] text-center">Selecione uma opção</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <PrimitiveSpan2 />
          <Icon3 />
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Label12 />
      <PrimitiveButton2 />
    </div>
  );
}

function Label13() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Produção Técnica</p>
    </div>
  );
}

function PrimitiveSpan3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[153.234px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px] text-center">Selecione uma opção</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton3() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <PrimitiveSpan3 />
          <Icon4 />
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Label13 />
      <PrimitiveButton3 />
    </div>
  );
}

function Label14() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Orientação - Concluída ou Em Andamento</p>
    </div>
  );
}

function PrimitiveSpan4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[153.234px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px] text-center">Selecione uma opção</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton4() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <PrimitiveSpan4 />
          <Icon5 />
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Label14 />
      <PrimitiveButton4 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[380px] items-start left-0 top-[1799px] w-[1024px]" data-name="Container">
      <Heading3 />
      <Paragraph12 />
      <Container13 />
      <Container14 />
      <Container15 />
      <Container16 />
    </div>
  );
}

function PrimitiveDiv3() {
  return <div className="absolute bg-[#404040] h-px left-0 top-[2211px] w-[1024px]" data-name="Primitive.div" />;
}

function Text9() {
  return (
    <div className="absolute content-stretch flex h-[23px] items-start left-[80.86px] top-0 w-[8.078px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#fb2c36] text-[16px]">*</p>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] left-0 not-italic text-[#fafafa] text-[16px] top-0">Impactos</p>
      <Text9 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[927px]">Avalie os impactos dos resultados da pesquisa obtidos até o momento na melhoria da infra-estrutura de laboratórios, aquisição de equipamentos, na formação de recursos humanos e na área de conhecimento envolvida na pesquisa.</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Houve Impacto Tecnológico?</p>
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton4() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label15() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text10 />
        <RadioButton4 />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton5() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label16() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text11 />
        <RadioButton5 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Label15 />
      <Label16 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph14 />
      <Container18 />
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Houve Impacto Econômico?</p>
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton6() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label17() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text12 />
        <RadioButton6 />
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton7() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label18() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text13 />
        <RadioButton7 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Label17 />
      <Label18 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph15 />
      <Container20 />
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Houve Impacto Social?</p>
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton8() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label19() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text14 />
        <RadioButton8 />
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton9() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label20() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text15 />
        <RadioButton9 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Label19 />
      <Label20 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph16 />
      <Container22 />
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Houve Impacto Ambiental?</p>
    </div>
  );
}

function Text16() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton10() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label21() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text16 />
        <RadioButton10 />
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton11() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label22() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text17 />
        <RadioButton11 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Label21 />
      <Label22 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph17 />
      <Container24 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[352px] items-start left-0 top-[2244px] w-[1024px]" data-name="Container">
      <Heading4 />
      <Paragraph13 />
      <Container19 />
      <Container21 />
      <Container23 />
      <Container25 />
    </div>
  );
}

function PrimitiveDiv4() {
  return <div className="absolute bg-[#404040] h-px left-0 top-[2628px] w-[1024px]" data-name="Primitive.div" />;
}

function Heading5() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[16px]">Parcerias Institucionais</p>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[1011px]">{`Indicar as instituições de P&D, empresas, órgãos públicos e não governamentais ou sociedade civil que foram parceiras durante a execução da pesquisa, mostrando articulação institucional vivenciada pela pesquisa.`}</p>
    </div>
  );
}

function TextArea5() {
  return (
    <div className="bg-[#171717] h-[138px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[12px] py-[8px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Digite aqui</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[108px]">0/500 palavras</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[277px] items-start left-0 top-[2661px] w-[1024px]" data-name="Container">
      <Heading5 />
      <Paragraph18 />
      <TextArea5 />
      <Paragraph19 />
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute content-stretch flex h-[23px] items-start left-[313.03px] top-0 w-[8.078px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#fb2c36] text-[16px]">*</p>
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] left-0 not-italic text-[#fafafa] text-[16px] top-0">Dificuldades encontradas e sugestões</p>
      <Text18 />
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#94a3b8] text-[14px]">Descreva dificuldades de caráter técnico-científico, financeiro, administrativo e gerencial, enfrentadas durante a realização da pesquisa.</p>
    </div>
  );
}

function TextArea6() {
  return (
    <div className="bg-[#171717] h-[138px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[12px] py-[8px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Digite aqui</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[107px]">0/250 palavras</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[257px] items-start left-0 top-[2962px] w-[1024px]" data-name="Container">
      <Heading6 />
      <Paragraph20 />
      <TextArea6 />
      <Paragraph21 />
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute content-stretch flex h-[23px] items-start left-[219.72px] top-0 w-[8.078px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#fb2c36] text-[16px]">*</p>
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] left-0 not-italic text-[#fafafa] text-[16px] top-0">Conclusões e Perspectivas</p>
      <Text19 />
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#94a3b8] text-[14px]">Descreva as conclusões do projeto e apresente perspectivas de trabalhos futuros que poderão ser financiados.</p>
    </div>
  );
}

function TextArea7() {
  return (
    <div className="bg-[#171717] h-[138px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[12px] py-[8px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Digite aqui</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[112px]">0/1000 palavras</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[257px] items-start left-0 top-[3243px] w-[1024px]" data-name="Container">
      <Heading7 />
      <Paragraph22 />
      <TextArea7 />
      <Paragraph23 />
    </div>
  );
}

function PrimitiveDiv5() {
  return <div className="absolute bg-[#404040] h-px left-0 top-[3532px] w-[1024px]" data-name="Primitive.div" />;
}

function Text20() {
  return (
    <div className="absolute content-stretch flex h-[23px] items-start left-[132.8px] top-0 w-[8.078px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#fb2c36] text-[16px]">*</p>
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[24px] left-0 not-italic text-[#fafafa] text-[16px] top-0">Avaliação Geral</p>
      <Text20 />
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">O resultado do projeto tem inovação tecnológica?</p>
    </div>
  );
}

function Text21() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton12() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label23() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text21 />
        <RadioButton12 />
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton13() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label24() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text22 />
        <RadioButton13 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Label23 />
      <Label24 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph24 />
      <Container30 />
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">O resultado do projeto (tecnologia gerada) pode ser repassado a terceiros?</p>
    </div>
  );
}

function Text23() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton14() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label25() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text23 />
        <RadioButton14 />
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton15() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label26() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text24 />
        <RadioButton15 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Label25 />
      <Label26 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph25 />
      <Container32 />
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">O resultado do projeto é passível de proteção (patentes, cultivares, direitos autorais ou softwares)?</p>
    </div>
  );
}

function Text25() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton16() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label27() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text25 />
        <RadioButton16 />
      </div>
    </div>
  );
}

function Text26() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton17() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label28() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text26 />
        <RadioButton17 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Label27 />
      <Label28 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph26 />
      <Container34 />
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Houve relação de pesquisa com atividades de ensino e de extensão na sua instituição (Ensino, Pesquisa e Extensão)?</p>
    </div>
  );
}

function Text27() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton18() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label29() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text27 />
        <RadioButton18 />
      </div>
    </div>
  );
}

function Text28() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton19() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label30() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text28 />
        <RadioButton19 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Label29 />
      <Label30 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph27 />
      <Container36 />
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Houve durante a execução da pesquisa momentos de interação e integração com a sociedade civil?</p>
    </div>
  );
}

function Text29() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[26.094px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Sim</p>
    </div>
  );
}

function RadioButton20() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label31() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.094px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text29 />
        <RadioButton20 />
      </div>
    </div>
  );
}

function Text30() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[24px] top-0 w-[28.281px]" data-name="Text">
      <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#fafafa] text-[14px]">Não</p>
    </div>
  );
}

function RadioButton21() {
  return <div className="absolute border-2 border-[#404040] border-solid left-0 rounded-[8px] size-[16px] top-[2px]" data-name="Radio Button" />;
}

function Label32() {
  return (
    <div className="h-[20px] relative shrink-0 w-[52.281px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text30 />
        <RadioButton21 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Label31 />
      <Label32 />
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[52px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph28 />
      <Container38 />
    </div>
  );
}

function Label33() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Descreva o público-alvo que pode se beneficiar com os resultados da pesquisa.</p>
    </div>
  );
}

function TextArea8() {
  return (
    <div className="bg-[#171717] h-[138px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[12px] py-[8px] relative size-full">
          <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">Digite aqui</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Poppins:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#94a3b8] text-[14px] top-0 w-[108px]">0/500 palavras</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[201px] items-start relative shrink-0 w-full" data-name="Container">
      <Label33 />
      <TextArea8 />
      <Paragraph29 />
    </div>
  );
}

function Label34() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 top-0 w-[1024px]" data-name="Label">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[14px]">Qual o número estimado de pessoas que podem se beneficiar com os resultados da pesquisa?</p>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute bg-[#171717] h-[38px] left-0 rounded-[6px] top-[28px] w-[174px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip px-[12px] py-[8px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Poppins:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[14px]">000000</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#404040] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[66px] relative shrink-0 w-full" data-name="Container">
      <Label34 />
      <TextInput1 />
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[663px] items-start left-0 top-[3565px] w-[1024px]" data-name="Container">
      <Heading8 />
      <Container31 />
      <Container33 />
      <Container35 />
      <Container37 />
      <Container39 />
      <Container40 />
      <Container41 />
    </div>
  );
}

function PrimitiveDiv6() {
  return <div className="absolute bg-[#404040] h-px left-0 top-[4260px] w-[1024px]" data-name="Primitive.div" />;
}

function Heading9() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Medium',sans-serif] leading-[24px] min-h-px min-w-px not-italic relative text-[#fafafa] text-[16px]">Inclusão de Arquivos</p>
    </div>
  );
}

function Paragraph30() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[20px] min-h-px min-w-px not-italic relative text-[#94a3b8] text-[14px]">Incluir documentos ou imagens relevantes para documentar o projeto</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[52px] items-start left-0 top-0 w-[1024px]" data-name="Container">
      <Heading9 />
      <Paragraph30 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[9px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p33834680} id="Vector" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[rgba(38,38,38,0.3)] border border-[#404040] border-solid h-[36px] left-[818.53px] rounded-[6px] top-[68px] w-[205.469px]" data-name="Button">
      <Icon6 />
      <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[20px] left-[114px] not-italic text-[#fafafa] text-[14px] text-center top-[7px] translate-x-[-50%]">Anexar Comprovação</p>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute h-[104px] left-0 top-[4293px] w-[1024px]" data-name="Container">
      <Container43 />
      <Button1 />
    </div>
  );
}

function PrimitiveDiv7() {
  return <div className="absolute bg-[#404040] h-px left-0 top-[4429px] w-[1024px]" data-name="Primitive.div" />;
}

function Button2() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[36px] relative rounded-[6px] shrink-0 w-[152.625px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#14b8a6] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[17px] py-[9px] relative size-full">
        <p className="css-ew64yg font-['Poppins:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#14b8a6] text-[14px] text-center">Salvar Rascunho</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_95_413)" id="Icon">
          <path d={svgPaths.p151c1700} id="Vector" stroke="var(--stroke-0, #0F172B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p15e62a80} id="Vector_2" stroke="var(--stroke-0, #0F172B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_95_413">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#14b8a6] h-[36px] relative rounded-[6px] shrink-0 w-[91.063px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon7 />
        <p className="absolute css-ew64yg font-['Poppins:Medium',sans-serif] leading-[20px] left-[58px] not-italic text-[#171717] text-[14px] text-center top-[8px] translate-x-[-50%]">Enviar</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[36px] items-center justify-end left-0 top-[4462px] w-[1024px]" data-name="Container">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Section() {
  return (
    <div className="absolute h-[4498px] left-[289.5px] top-[266px] w-[1024px]" data-name="Section">
      <Container />
      <Container1 />
      <Container5 />
      <Container8 />
      <PrimitiveDiv1 />
      <Container12 />
      <PrimitiveDiv2 />
      <Container17 />
      <PrimitiveDiv3 />
      <Container26 />
      <PrimitiveDiv4 />
      <Container27 />
      <Container28 />
      <Container29 />
      <PrimitiveDiv5 />
      <Container42 />
      <PrimitiveDiv6 />
      <Container44 />
      <PrimitiveDiv7 />
      <Container45 />
    </div>
  );
}

function TecnicaPage() {
  return (
    <div className="absolute bg-[#171717] h-[4796px] left-0 top-0 w-[1603px]" data-name="TecnicaPage">
      <Button />
      <Header />
      <PrimitiveDiv />
      <Section />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M2.66667 3.33333H13.3333" id="Vector" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 8H13.3333" id="Vector_2" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.66667 12.6667H13.3333" id="Vector_3" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[6px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Button">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgButton} />
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[36px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_95_417)" id="Icon">
          <path d={svgPaths.p3adb3b00} id="Vector" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 1.33333V2.66667" id="Vector_2" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 13.3333V14.6667" id="Vector_3" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p22049780} id="Vector_4" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2ff5aa00} id="Vector_5" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H2.66667" id="Vector_6" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 8H14.6667" id="Vector_7" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19069f80} id="Vector_8" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p37cddcc0} id="Vector_9" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_95_417">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 rounded-[6px] size-[36px] top-0" data-name="Button">
      <Icon9 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[88px] rounded-[6px] size-[36px] top-0" data-name="Button">
      <Icon10 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p388cb800} id="Vector" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p5baad20} id="Vector_2" stroke="var(--stroke-0, #F8FAFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[44px] rounded-[6px] size-[36px] top-0" data-name="Button">
      <Icon11 />
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[36px] relative shrink-0 w-[124px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button6 />
        <Button7 />
        <Button8 />
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Navigation">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] relative size-full">
          <Container46 />
          <Container47 />
        </div>
      </div>
    </div>
  );
}

function Header1() {
  return (
    <div className="absolute bg-[rgba(15,23,43,0.6)] content-stretch flex flex-col h-[65px] items-start left-0 pb-px px-[33.5px] top-0 w-[1603px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#404040] border-b border-solid inset-0 pointer-events-none" />
      <Navigation />
    </div>
  );
}

export default function NuxtPortalCoordenador() {
  return (
    <div className="bg-[#171717] relative size-full" data-name="Nuxt - Portal Coordenador">
      <TecnicaPage />
      <Header1 />
    </div>
  );
}