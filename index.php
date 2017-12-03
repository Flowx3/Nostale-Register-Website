<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once "./Config.php";
include_once $_SERVER['DOCUMENT_ROOT'].'/config/Database.php';
include_once $_SERVER['DOCUMENT_ROOT'].'/config/recaptchalib.php';

$Config = new Config();
?>

<!DOCTYPE html>

<html>
<head>

    <meta http-equiv="cache-control" content="no-cache"> <!-- tells browser not to cache -->
    <meta http-equiv="expires" content="0"> <!-- says that the cache expires 'now' -->
    <meta http-equiv="pragma" content="no-cache"> <!-- says not to use cached stuff, if there is any -->
    <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title><?php echo $Config->Name; ?></title>
	
	<link rel="icon" href="<?php echo $WebsiteURL;?>/icon.ico" type="image/x-icon" />
    <link rel="stylesheet" type="text/css" href="<?php echo $WebsiteURL; ?>/css/style.css" />
    <script src='https://www.google.com/recaptcha/api.js'></script>
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"
            integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
            crossorigin="anonymous"></script>
    

</head>

<body id="root" class="isLoading">
	<div class="site_wrapper">
		<div class="main_border_left"></div>
		<div class="main_border_right"></div>
		<div class="nav" id="scroll">
            <ul id="scrollNav" class=" selected_section_0">
                <li id='scroll1' class="active">
                    <span></span>
                </li>
                <li id='scroll2'>
                    <span></span>
                </li>
                <li id='scroll3'>
                    <span></span>
                </li>
                <li id='scroll4'>
                    <span></span>
                </li>
                <li id='scroll5'>
                    <span></span>
                </li>
                <li id='scroll6'>
                    <span></span>
                </li>
                <li id='scroll7'>
                    <span></span>
                </li>
            </ul>
		</div>
		<script type="text/javascript">
			function isTouchDevice() {
			    return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
			}

			if (isTouchDevice() === true) {
			    document.getElementById('scroll').className='touch';
			}

		</script>

		<div class="section " id="start">
			<div class="trans transStart"></div>
			<div id="menu">
				<div class="inner">
					<div class="inner_pos">
                        
                        <?php
                        if(!empty($_GET['reg'])){
                            $reg = $_GET['reg'];
                            if($reg =="fail"){
                                echo '<p><font size="3" color="red"><b>Register failed Please try it again! Please Retry the Register.</b></font></p>';
                            }
                            if($reg =="success"){
                                echo '<p><b><font size="3" color="green"><b>Register done! You can now Login with your Data.</b></font></p>';
                            }
							if($reg =="wrong_captcha"){
								echo '<p><b><font size="3" color="red"><b>Please Check the Captcha!</b></font></p>';
							}
							

                        }
                       

                        ?>

                        <button class="btn_play btn_cta" rel="bottomArea" data-type="scrollto7" id="scrollto7">Play for Free</button>
                        <button class="btn_play btn_cta btn_steam" onclick="location.href='./download/download.php?file=NosTale.exe'">Download</button>

					</div>
				</div>
			</div>
			<div class="vidBGOuter">
				<div id="vidBG"></div>

				<div class="logo_wrapper_positioner">
					<a href='<?php echo $WebsiteURL ?>' style="text-decoration:none;">
						<div class="logo_wrapper">
							<h1 id="logo"><?php echo $Config->Name; ?></h1>
							<h2 class="claim text_shadow"><?php echo utf8_encode($Config->LogoDescription); ?></h2>
						</div>
					</a>
				</div>
				<div id="videoPreviewMobile" class="clearfix">
					<div class="video_wrapper">
						<div class="video trailer">
							<div class="btn btn_video" data-type="trailer" id="playTrailerPhone">
								<span class="text_shadow">Trailer</span>
							</div>
						</div>
					</div>
					<div class="video_wrapper">
						<div class="video screenshots">
							<div class="btn" data-type="gameplay" id="playGameplayPhone">
								<span class="text_shadow">Ranking</span>
							</div>
						</div>
					</div>
				</div>
				<div id="videoPreview" class="clearfix">
					<div class="video_wrapper left">
						<div class="video trailer">
							<div id="vid1"></div>
							<div class="btn btn_video" data-type="trailer" id="playTrailer">
								<span class="text_shadow">Trailer</span>
							</div>
						</div>
					</div>
					<div class="video_wrapper right">
						<div class="video screenshots">
							<div id="vid2"></div>
							<div class="btn" data-type="gameplay" id="playGameplay" style="cursor: pointer;">
								<span class="text_shadow">Ranking</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="landing">

			<div class="section" id="one">
				<div class="features_wrapper">
					<div class="features">
						<h3> <?php echo utf8_encode($Config->FirstHeader); ?> 
                        </h3>
						<ul class="feature_list">
							<li><?php echo utf8_encode($Config->FirstFeatureList1); ?></li>
							<li><?php echo utf8_encode($Config->FirstFeatureList2); ?></li>
							<li><?php echo utf8_encode($Config->FirstFeatureList3); ?></li>
							<li><?php echo utf8_encode($Config->FirstFeatureList4); ?></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="section" id="two">
				<div class="features_wrapper">
					<div class="features">
						<h3><?php echo utf8_encode($Config->SecondHeader); ?></h3>
						<ul class="feature_list">
							<li><?php echo utf8_encode($Config->SecondFeatureList1); ?></li>
							<li><?php echo utf8_encode($Config->SecondFeatureList2); ?></li>
							<li><?php echo utf8_encode($Config->SecondFeatureList3); ?></li>
							<li><?php echo utf8_encode($Config->SecondFeatureList4); ?></li>
						</ul>
					</div>
				</div>
				<div class="char char_warrior"></div>
			</div>
			<div class="section" id="three">
				<div class="features_wrapper">
					<div class="features">
						<h3><?php echo utf8_encode($Config->DescriptionHeader); ?></h3>
						<p><?php echo utf8_encode($Config->Description); ?></p>
					</div>
				</div>
			</div>
            <div class="section" id="media">
                <div id="mediaSlider">
                </div>
                <br />
                <h3 class="text_shadow">Level Ranking</h3><?php Database('1',null);?>
                <h3 class="text_shadow">Reputation Ranking</h3><?php Database('2',null);?>
                <div id="mediaResponsive">
                </div>
            </div>
			<div class="section no_divider" id="system">
                <div id="systemRequirement" class="clearfix">
                    <h3 class="text_shadow">System requirements</h3>
                    <!-- 	        <div class="table_wrapper"> -->
                    <table>
                        <colgroup>
                            <col class="name" />
                            <col class="min" />
                            <col class="max" />
                        </colgroup>
                        <thead>
                            <tr>
                                <td></td>
                                <td>Minimum:</td>
                                <td>Recommended:</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>OS</td>
                                <td>Win Vista, Win 7, Win 8, Win 10</td>
                                <td>Win Vista, Win 7, Win 8, Win 10</td>
                            </tr>
                            <tr>
                                <td>CPU</td>
                                <td>
                                    <span>Pentium 3 500 MHz</span>
                                </td>
                                <td>
                                    <span>Pentium 3 800 MHz</span>
                                </td>
                            </tr>
                            <tr>
                                <td>RAM</td>
                                <td>
                                    <span>256 MB</span>
                                </td>
                                <td>
                                    <span>512 MB</span>
                                </td>
                            </tr>
                            <tr>
                                <td>Hard Drive</td>
                                <td>
                                    <span>3 GB</span>
                                </td>
                                <td>
                                    <span>4 GB</span>
                                </td>
                            </tr>
                            <tr>
                                <td>Graphics Card</td>
                                <td>
                                    ATI Radeon 7000,
                                    <br />
                                    NVidia RIVA TNT2
                                </td>
                                <td>GeForce 2 MX</td>
                            </tr>
                            <tr>
                                <td>Sound Card</td>
                                <td>Supports DirectX 9.0</td>
                                <td>Supports DirectX 9.0</td>
                            </tr>
                            <tr>
                                <td>Internet</td>
                                <td>Broadband connection required</td>
                                <td>Broadband connection required</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="char char_bushi"></div>
                </div>
				<div id="systemRequirementSmartphone" class="clearfix">
					<h3 class="text_shadow">System requirements</h3>
					<div id="systemRequirementAccordion">
						<div class="open" onclick="ToggleAccordion(this)">
							<span>
								<i class="icon arrows"></i>Minimum requirements
							</span>
							<table>
								<tbody>
									<tr>
										<th>OS</th>
										<td>Win Vista, Win 7, Win 8, Win 10</td>
									</tr>
									<tr>
										<th>CPU</th>
										<td>Pentium 3 500 MHz</td>
									</tr>
									<tr>
										<th>RAM</th>
										<td>256 MB</td>
									</tr>
									<tr>
										<th>Hard Drive</th>
										<td>3 GB</td>
									</tr>
									<tr>
										<th>Graphics Card</th>
										<td>
											ATI Radeon 7000,
											<br />
											NVidia RIVA TNT2
										</td>
									</tr>
									<tr>
										<th>Sound Card</th>
										<td>Supports DirectX 9.0</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div onclick="ToggleAccordion(this)">
							<span>
								<i class="icon arrows"></i>Recommended requirements
							</span>
							<table style="display:none">
								<tbody>
									<tr>
										<th>OS</th>
										<td>Win Vista, Win 7, Win 8, Win 10</td>
									</tr>
									<tr>
										<th>CPU</th>
										<td>Pentium 3 800 MHz</td>
									</tr>
									<tr>
										<th>Ram</th>
										<td>512 MB</td>
									</tr>
									<tr>
										<th>Hard Drive</th>
										<td>4 GB</td>
									</tr>
									<tr>
										<th>Graphics Card</th>
										<td>GeForce 2 MX</td>
									</tr>
									<tr>
										<th>Sound Card</th>
										<td>Supports DirectX 9.0</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<script type="text/javascript">

					function ToggleAccordion(el) {

						// close all
						var siblings = el.parentNode.childNodes;
						for (var i = 0; i < siblings.length; i++) {
							var item = siblings[i];
							if (item.nodeType===1 && item!==el) {
								var	ul = item.getElementsByTagName('TABLE')[0];
								ul.style.display = 'none';
								item.className = '';
							}
						}

						var	ul = el.getElementsByTagName('TABLE')[0];

						if (ul.style.display === 'none') {
							ul.style.display = 'block';
							el.className = 'open';
						} else {
							ul.style.display = 'none';
							el.className = '';
						}
					};

					</script>
				</div>
			</div>
           <div class="section no_divider" id="bottomArea">
	    		<h3 class="text_shadow">Become a Legend of <?php echo $Config->Name;?></h3>
				<div id="registerFormBottomArea" class="clearfix">
					<form name="regForm2" id="regForm2" action="<?php echo $WebsiteURL;?>/register" method="get">
						<h4>Register now</h4>
						<input type="hidden" name="tac" value="tac"/>
		            	<input type="hidden" name="kid" value="kid"/>
			            <label>Account name:</label>
			            <br/><span>(5-16 characters, no special characters)</span>
			            <div class="input_wrapper">
			                <input id="usernameInput1" type="text" onblur="validateAjax(event)" class="registrationInput" name="username" value="" />
			                <div class="error_info "></div>
			            </div>

                        <label>Password:</label>
                        <div class="positioner">
                            <div class="helpIcon" id="helpIcon1"></div>
                            <div class="password_info password_info2">
                                <p><strong>Recommended for secure password:</strong></p>
                                <ul>
                                    <li><span>at least one lowercase letter</span></li>
                                    <!--<li><span></span></li>-->
                                    <li><span>at least one number</span></li>
                                </ul>
                            </div>
                        </div>
                        <br/><span>(4-16 characters, no special characters)</span>
		                <div class="input_wrapper">
                                    <input class="registrationInput" name="password" type="password" autocomplete="off"/>
		                    <div class="error_info "></div>
		                
		                </div>
			            <label>Email:</label>
			            <div class="input_wrapper">
			                <input type="text" class="registrationInput" name="email" value=""/>
			                <div class="error_info "></div>
			            </div>
						<div class="g-recaptcha" data-sitekey="<?php echo $Config->CaptchaPublicKey; ?>"></div>
                        <button class="btn_play" onclick="validateBottom(); return false;">Play for Free</button>
                    </form>
                </div>
            <div class="char char_owl"></div>
           </div>
		</div>
		<div class="footer">
			<div class="inner clearfix">
				<div class="logos_ranking">
					<div class="clearfix">
						<a class="usk" target="_blank" href="http://www.usk.de/en/">&nbsp;</a>
						<a class="pegi" target="_blank" href="http://www.pegi.info/en/index">&nbsp;</a>
					</div>
				</div>
				<div>
					<p class="legal_line">
						Website modified and Created by Flowx3
						<br />
						All rights reserved. All trademarks are the property of their respective owners.
					</p>
					<p class="legal">
						
					</p>
				</div>
			</div>
		</div>
	</div>

	<script type="text/javascript" src="<?php echo $WebsiteURL; ?>/js/2b0b26d7802ac8d236d0b0a79d0219.js"></script>
    <script type="text/javascript" src="<?php echo $WebsiteURL; ?>/js/main.js"></script>
	<script type="text/javascript">
        var unameSuggest = '';

        function suggest(field, rules, i, options) {
            if (unameSuggest) {
                return unameSuggest;
            }
        }

        function validateOverlay() {
            if (validatorOverlay.validateForm()) {
                var evt = document.createEvent("CustomEvent");
                evt.initCustomEvent('blur', false, false, {
                    'doSubmit': true,
                    'validator': validatorOverlay
                });
                document.querySelector('input#usernameInput2').dispatchEvent(evt);
            }
        }

        function validateBottom() {
            if (validator.validateForm()) {
                var evt = document.createEvent("CustomEvent");
                evt.initCustomEvent('blur', false, false, {
                    'doSubmit': true,
                    'validator': validator
                });
                document.querySelector('input#usernameInput1').dispatchEvent(event);
            }
        }

        function replaceUsername(newName, elName) {
            el = document.getElementById(elName);
            el.value = newName;
            validator.validateForm();
        }

        GF.Validator.prototype.validateUsernameTaken = function (data, el) {
            if (data && data !== "") {
                this.fieldErrors = [];
                this.fieldErrors.push(data);
                this.formErrors = true;
                this.formatField(el, this.fieldErrors);
            }
        }

        function validateAjax(event) {

            var eventSrc = event.target || event.srcElement;

            url = "<?php echo $WebsiteURL;?>/CheckUserName/?a=" + eventSrc.value;
            var http = new XMLHttpRequest();
            http.open("GET", url, true);
            http.onreadystatechange = function () {
                if (http.readyState == 4 && http.status == 200) {
                    var data = http.responseText;
                    var replaceString = "$1<a href=\"#\" onClick=\"replaceUsername('$2','" + eventSrc.id + "'); return false;\">$2</a>$3";
                    if (data && data !== "") {
                        data = data.replace(/(.*)\{(.*)\}(.*)/, replaceString);
                        validator.validateUsernameTaken(data, eventSrc);
                    } else if (event.detail.doSubmit) {
                        event.detail.validator.form.submit();
                    }
                }
            }
            http.send();
        }



        // Activating modules of main.js
        var overlay = GF.newOverlay(
            "overlayWrapper"
        );
        overlay.bind(GF.byId('steamCheck'));
        overlay.bind(GF.byId("register"), function () {
            GF.addCls(GF.byId("start"), 'open-register');
        }, function () {
            GF.removeCls(GF.byId("start"), 'open-register');
        });

        var imgPath = '/cdn/landingpages/index/img/gallery/';
        var sliderConfig = {
            tabTitles: ["Screenshots", "Artworks"],
            tabs: [
                [// screenshots
                    ["//gf2.geo.gfsrv.net/cdn7e/ebac77b3e3e7a7f1625db31f195ec2.jpg", "//gf3.geo.gfsrv.net/cdn23/aaa0cb22defaffe979c298e893b6b2.jpg", "", 'screenshot'],
                    ["//gf1.geo.gfsrv.net/cdnc6/2d5050b6d9ead445f799f677358e82.jpg", "//gf3.geo.gfsrv.net/cdnec/f23a85f6faacee84b55e9ba2328224.jpg", "", 'screenshot'],
                    ["//gf1.geo.gfsrv.net/cdn94/4d08747043337544e828d0db93a74f.jpg", "//gf2.geo.gfsrv.net/cdna6/20cc9620aa4ba037138b149b6bdc0b.jpg", "", 'screenshot'],
                    ["//gf1.geo.gfsrv.net/cdnfb/dc81cbb0e86da05e29e2e54af8278b.jpg", "//gf3.geo.gfsrv.net/cdn5d/f7faf52252a7af937a2c7952143fc3.jpg", "", 'screenshot'],
                    ["//gf3.geo.gfsrv.net/cdn5e/1a8e55b90b347ba8e9273375e52bd0.jpg", "//gf3.geo.gfsrv.net/cdne2/9f95b60771c1e2ed62e9271d6c0b22.jpg", "", 'screenshot']
                ],
                [// screenshots
                    ["//gf2.geo.gfsrv.net/cdnd9/0ed6513e11c466a7ed45c1a239c405.jpg", "//gf2.geo.gfsrv.net/cdn7b/08f6d2d64feffcac859c4dc2ddae0c.jpg", "", 'artwork'],
                    ["//gf2.geo.gfsrv.net/cdn46/fe6e11d4c3248f8b45e4516712ec1c.jpg", "//gf3.geo.gfsrv.net/cdnbd/60cd360788dcfc372fe063b364e63e.jpg", "", 'artwork'],
                    ["//gf2.geo.gfsrv.net/cdna1/f0ea5f40516c27c91cd99a367a489e.jpg", "//gf2.geo.gfsrv.net/cdn48/1febec2c76439142e220fa3df940e9.jpg", "", 'artwork'],
                    ["//gf1.geo.gfsrv.net/cdn31/8c21f68ac1d6a7b6016fc5553414c2.jpg", "//gf2.geo.gfsrv.net/cdndc/9f093e075c4571270a2b8064ee3776.jpg", "", 'artwork'],
                    ["//gf1.geo.gfsrv.net/cdncc/c1f2d7437871662f4818c7677e4e85.jpg", "//gf2.geo.gfsrv.net/cdn77/b1a2315860657a9363e1197548d8e4.jpg", "", 'artwork'],
                    ["//gf2.geo.gfsrv.net/cdnd9/02cc4dd10e5f7ae5fce28aeda75a01.jpg", "//gf2.geo.gfsrv.net/cdnab/ff02628224ebd4c039e2a7d3b36135.jpg", "", 'artwork']
                ]
            ]
        };

        var videos = GF.newVideoManager();
        var scrollManager;

        if (!window.matchMedia || window.matchMedia("(min-width: 1024px)").matches) {

            // scroll behaviour
            scrollManager = GF.newScrollManager(
                "landing", // required
                "scrollNav", // required
                "menu" // optional
            );


            scrollManager.setStickyOffset(-18);
        }
        else {
            scrollManager = GF.newScrollManager(
                "landing", // required
                "scrollNav", // required
                "menu" // optional
            );


            scrollManager.setStickyOffset(-18);
            if (GF.hasCls(GF.byId('scroll1'), 'active')) {
                scrollManager.scrollIntoView(1)
            }
            else if (GF.hasCls(GF.byId('scroll2'), 'active')) {
                scrollManager.scrollIntoView(2)
            }
            else if (GF.hasCls(GF.byId('scroll3'), 'active')) {
                scrollManager.scrollIntoView(3)
            }
            else if (GF.hasCls(GF.byId('scroll4'), 'active')) {
                scrollManager.scrollIntoView(4)
            }
            else if (GF.hasCls(GF.byId('scroll5'), 'active')) {
                scrollManager.scrollIntoView(5)
            }
            else if (GF.hasCls(GF.byId('scroll6'), 'active')) {
                scrollManager.scrollIntoView(6)
            }
            else if (GF.hasCls(GF.byId('scroll7'), 'active')) {
                scrollManager.scrollIntoView(6)
            }
        }

        videos.initButtonForOverlay(
            "playTrailer", // (required) id of element to trigger overlay
            {
                videoID: "ytTrailer",
                youtube: {
                    id: "<?php echo $Config->YTVideoID; ?>", // (required) id of video (just something unique)
                    width: 640,
                    height: 360
                }
            },
            overlay
        );

        function showScreenshots() {
            var gId = (isTouchDevice()) ? "mediaResponsive" : "mediaSlider";
            if ((GF.ie && GF.ie < 9) || !scrollManager) {
                GF.byId(gId).scrollIntoView(true);
            } else {
                var toScroll = window.pageYOffset + GF.byId(gId).getBoundingClientRect().top - 200;
                scrollManager.smoothScroll(document.documentElement, 300, toScroll);
            }
        }

        GF.addListener(GF.byId("playGameplay"), "click", showScreenshots);
        GF.addListener(GF.byId("playGameplayPhone"), "click", showScreenshots);
		GF.addListener(GF.byId("scrollto7"), "click", function(){
			scrollManager.scrollIntoView(6)
		});
        // small screens
        GF.addListener(GF.byId("playTrailerPhone"), "click", function () {
            window.open("<?php echo $Config->YTVideo; ?>");
        });

        if (!window.matchMedia || window.matchMedia("(min-width: 1280px)").matches) {

            // onload
            GF.addListener(window, 'load', function () {
                // < ie9
                if (!window.matchMedia) {

                    document.body.className = "loaded";
                    var contentSlider = GF.newContentSlider(
                        "mediaSlider", // required
                        sliderConfig // required
                    );

                } else {

                    videos.initVideo(
                        "vidBG",
                        {
                            videoID: "video",
                            sources: {
                                mp4: "//gf1.geo.gfsrv.net/cdn99/252ed4e562f8d8e10a81773f78d317.mp4",
                                webm: "//gf3.geo.gfsrv.net/cdne8/ff3ffd0fa1ff7c51e0d11fd4b7c54d.webm",
                                ogv: "//gf3.geo.gfsrv.net/cdn89/1d360e826aa416fec33ac97e538bc2.ogv"
                            },
                            poster: "//gf1.geo.gfsrv.net/cdn90/a67e9f877b86c386caa7c8ade1daf7.jpg",
                            autoplay: true,
                            width: 1920,
                            height: 850,
                            loop: false,
                            showControls: false,
                            onEnded: function (vid) {
                                vid.currentTime = 5.5;
                                // keep this for safari
                                setTimeout(function () {
                                    vid.play();
                                }, 0)
                            },
                            onTimeUpdate: function (vid) {
                                if (vid.currentTime >= 5.5 && document.body.className != "loaded") {
                                    document.body.className = "loaded";
                                    var contentSlider = GF.newContentSlider(
                                        "mediaSlider", // required
                                        sliderConfig // required
                                    );
                                }
                            }
                        }
                    );
                }
            });

        } else {

            document.body.className = "loaded";

            var sGalWidth = (window.matchMedia("(min-width: 768px)").matches) ? 600 : null;

            // show matching gallery for touch or desktop
            if (isTouchDevice() === true) {

                var simpleGalery = GF.newSimpleGalery("mediaResponsive", sliderConfig, sGalWidth);

            } else {
                var contentSlider = GF.newContentSlider(
                    "mediaSlider", // required
                    sliderConfig // required
                );
            }
        }

        GF.byId("mediaSlider").style.display = (isTouchDevice()) ? "none" : "block";
        GF.byId("mediaResponsive").style.display = (isTouchDevice()) ? "block" : "none";


        // form validation
        var validationLoca = {
            noSpecialChars: 'No special characters allowed',
            onlyValidPwdChars: 'No special characters allowed',
            req: { username: 'Please enter a NosTale account name!', email: 'Please enter your current email address!', password: 'Please enter a password!' },
            len: function (min, max) {
                return 'Between ' + min + ' and ' + max + ' characters allowed'
            },
            email: 'The email address appears to be invalid.'
        }

        var validationOpts = { // (optional) field config
            email: {
                check: true,
                name: "email",
            },
            username: {
                check: true,
                name: "username",
                minsize: 5,
                maxsize: 16
            },
            password: {
                check: true,
                name: "password",
                minsize: 4,
                maxsize: 16
            }
        }

        var validator = GF.newValidator(
            "regForm2",
            validationLoca,
            validationOpts
        );

        GF.addListener(GF.byId("moreInfo"), "click", function () {
            if (GF.hasCls(GF.byId('scroll1'), 'active')) {
                scrollManager.scrollIntoView(1);
            }
            if (GF.hasCls(GF.byId('scroll2'), 'active')) {
                scrollManager.scrollIntoView(2);
            }
            if (GF.hasCls(GF.byId('scroll3'), 'active')) {
                scrollManager.scrollIntoView(3);
            }
            if (GF.hasCls(GF.byId('scroll4'), 'active')) {
                scrollManager.scrollIntoView(4);
            }
            if (GF.hasCls(GF.byId('scroll5'), 'active')) {
                scrollManager.scrollIntoView(5);
            }
            if (GF.hasCls(GF.byId('scroll6'), 'active')) {
                scrollManager.scrollIntoView(6);
            }
            if (GF.hasCls(GF.byId('scroll7'), 'active')) {
                scrollManager.scrollIntoView(6);
            }
        });
	</script>


    <script type="text/javascript" src="<?php echo $WebsiteURL; ?>/js/functions.js"></script>
	<script type="text/javascript">
        setPixel({
            'location': 'VISIT',
            'product': 'nostale',
            'language': 'en',
            'server-id': '1'
        });
	</script>
	<script>
        var registrationStarted = false;
        function setRegistrationStartedPixel() {
            if (!registrationStarted) {
                setPixel({
                    'location': 'registration_started',
                    'product': 'nostale',
                    'language': 'en',
                    'server_id': '1'
                });
                registrationStarted = true;
            }
        }

        var registrationInputs = document.body.querySelectorAll('.registrationInput');
        for (var i = 0; i < registrationInputs.length; i++) {
            registrationInputs[i].onkeydown = setRegistrationStartedPixel;
        }
	</script>

</body>

</html>