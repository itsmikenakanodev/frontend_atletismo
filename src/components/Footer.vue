<template>
    <footer class="footer mt-4">
        <div class="container">
            <div class="row">
                <div class="footer-col">
                    <div class="aname">
                        <a href="#"><img id="anameAtleta" src="../modules/Inicio/assets/aname-footer.png" alt="" /></a>
                        <p>Asociación Nacional De Atletismo Máster Del Ecuador</p>
                        <div class="social-links">
                            <a href="https://www.facebook.com/p/ANAME-Asociaci%C3%B3n-Nacional-de-Atletismo-Master-del-Ecuador-100064841912450/"><i class="pi pi-facebook"></i></a>
                        </div>
                     </div>
                </div>
                <div class="footer-col">
                    <h4>Calendario de Campeonatos</h4>
                    <ul>
                        <li><a @click.prevent="$router.push('/calendarios')" href="">Calendario</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Ponte en contacto con nosotros</h4>
                    <ul>
                        <li><a @click.prevent="$router.push('/contacto')" href="">Contáctanos</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Campeonatos internacionales</h4>
                    <ul>
                        <li><a href="https://sportec.cl/">SPORTEC</a></li>
                    </ul>
                </div>
            </div>
            <div class="anio">
                {{ new Date().getFullYear() }} — <strong>ANAME</strong>
            </div>
        </div>
    </footer>
</template>

<script>
export default {};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    line-height: 1.5;
}

.container {
    max-width: 1920px;
    margin: auto;
}

ul {
    list-style: none;
}

.row {
    display: flex;
    flex-wrap: wrap;

    justify-content: center;
}

.footer {
    background-color: #07393C;
    padding-top: 100px;
    padding-bottom: 35px;
}

.row .footer-col:first-child {
      width: 30%;
    }

.footer-col{
   width: 17%;
   padding: 0 10px;
}
.footer-col h4{
	font-size: 17px;
	color: #ffffff;

	margin-bottom: 20px;
	font-weight: bolder;
	position: relative;
}
.footer-col h4::before{
	content: '';
	position: absolute;
	left:0;
	bottom: -10px;
	background-color: #90ddf0;
	height: 2px;
	box-sizing: border-box;
	width: 75%;
    
}
.footer-col ul li:not(:last-child){
	margin-bottom: 7px;
}
.footer-col ul li a{
	font-size: 16px;
	text-transform: capitalize;
	color: #ffffff;
	text-decoration: none;
	font-weight: 300;
	color: #bbbbbb;
	display: block;
	transition: all 0.3s ease;
}
.footer-col ul li a:hover{
	color: #ffffff;
	padding-left: 8px;
}
.footer-col .social-links a{
	display: inline-block;
	height: 40px;
	width: 40px;
	background-color: rgba(255,255,255,0.2);
	margin:0 10px 10px 0;
	text-align: center;
	line-height: 40px;
	border-radius: 50%;
	color: #ffffff;
	transition: all 0.5s ease;
}

.social-links{
    display: flex;
    justify-content: center;
    margin-top: 7px;
}
.footer-col .social-links a:hover{
	color: #07393C;
	background-color: #ffffff;
}

/*responsive*/
@media(max-width: 767px){
  .footer-col{
    width: 50%;
    margin-bottom: 30px;
}

.row .footer-col:first-child {
      width: 50%;
    }
}
@media(max-width: 574px){
  .footer-col, .row .footer-col:first-child{
    width: 100%;
}

}

.aname{
    text-align: center;
}

.anio{
    display: flex;
    align-content: center;
    justify-content: center;
    margin-top: 10px;
    color: #ffffff;
}

#anameAtleta{
    width: 100%;
    height: 100%;
    max-width: 300px
}

.footer-col p{
	font-size: 16px;
	text-transform: capitalize;
	color: #ffffff;
	text-decoration: none;
	font-weight: 300;
	color: #bbbbbb;
	display: block;
	transition: all 0.3s ease;
}

</style>