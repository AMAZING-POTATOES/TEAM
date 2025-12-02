-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: amazing_potatoes
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `recipe_comments`
--

DROP TABLE IF EXISTS `recipe_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_comments` (
  `comment_id` bigint NOT NULL AUTO_INCREMENT,
  `recipe_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `idx_recipe_id` (`recipe_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `recipe_comments_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE,
  CONSTRAINT `recipe_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_comments`
--

LOCK TABLES `recipe_comments` WRITE;
/*!40000 ALTER TABLE `recipe_comments` DISABLE KEYS */;
INSERT INTO `recipe_comments` VALUES (1,1,4,'정석적인 레시피네요','2025-11-27 08:55:38','2025-11-27 08:55:38'),(3,4,4,'맛있는 레시피네요 ','2025-12-01 07:57:48','2025-12-01 07:57:48'),(6,2,4,'제가 좋아하는 메뉴인데 정말 좋은 레시피에요\n','2025-12-01 08:32:14','2025-12-01 08:32:14'),(8,5,4,'카레 참 맛있죠 ㅎㅎ','2025-12-01 08:37:08','2025-12-01 08:37:08'),(9,6,4,'정말 최고의 맛이에요','2025-12-01 08:42:27','2025-12-01 08:42:27');
/*!40000 ALTER TABLE `recipe_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_ingredients`
--

DROP TABLE IF EXISTS `recipe_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_ingredients` (
  `recipe_ingredient_id` bigint NOT NULL AUTO_INCREMENT,
  `recipe_id` bigint NOT NULL,
  `ingredient_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`recipe_ingredient_id`),
  KEY `idx_recipe_id` (`recipe_id`),
  KEY `idx_ingredient_name` (`ingredient_name`),
  CONSTRAINT `recipe_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_ingredients`
--

LOCK TABLES `recipe_ingredients` WRITE;
/*!40000 ALTER TABLE `recipe_ingredients` DISABLE KEYS */;
INSERT INTO `recipe_ingredients` VALUES (1,1,'신김치','약 1/4 포기 (350g ~ 400g)'),(2,1,'돼지고기 (앞다리살/목살 찌개용)','300g ~ 350g'),(3,1,'두부','1/2 모 ~ 1 모'),(4,1,'물 또는 멸치 다시마 육수','3컵 (약 540ml)'),(5,1,'김칫국물','1/2컵 ~ 1컵 (약 100ml)'),(6,1,'양파','1/4 개'),(7,1,'대파','1 대'),(8,1,'다진 마늘','1 큰술'),(9,1,'고춧가루','1 ~ 1.5 큰술'),(10,1,'새우젓 또는 참치액젓','1 큰술'),(11,1,'설탕','2/3 큰술 ~ 1 큰술'),(12,1,'국간장 (또는 진간장)','1 큰술'),(13,1,'참기름 또는 들기름','1 큰술'),(14,2,'차돌박이','100g'),(15,2,'두부','1/2모'),(16,2,'애호박','1/4개'),(17,2,'감자','1/4개'),(18,2,'양파','1/4개'),(19,2,'대파','1/2대'),(20,2,'멸치 다시마 육수','400ml (2컵)'),(21,2,'된장','1.5 ~ 2 큰술'),(22,2,'다진 마늘','1/2 큰술'),(23,2,'고춧가루 (선택)','1/2 큰술'),(24,3,'스파게티 면','80g ~ 90g'),(25,3,'돼지고기 (관찰레/판체타/두툼한 베이컨)','50g ~ 1줄'),(26,3,'계란 노른자','2개'),(27,3,'파르미지아노 레지아노 치즈 (간 것)','25g ~ 4 큰술'),(28,3,'후추','적당량'),(29,3,'소금','1 큰술'),(30,3,'면수','1/2 컵 (필요시 조절)'),(31,4,'소불고기감 (얇게 썬 것)','300g'),(32,4,'양파','1/2개'),(33,4,'당근','1/3개'),(34,4,'대파','1대'),(35,4,'새송이/느타리/팽이 버섯','적당량'),(36,4,'간장','10 큰 술'),(37,4,'설탕','3.5 큰 술'),(38,4,'물엿/올리고당','1.5 큰 술'),(39,4,'다진 마늘','2 큰 술'),(40,4,'참기름','1 큰 술'),(41,4,'맛술/청주','1 큰 술'),(42,4,'배즙 또는 사과/양파즙','1/2컵'),(43,4,'물','1/2 종이컵'),(44,5,'돼지고기/소고기 (카레용)','200g'),(45,5,'감자','2개'),(46,5,'당근','1/2개'),(47,5,'양파','1개'),(48,5,'시판 고형 또는 분말 카레','100g ~ 120g'),(49,5,'물 또는 육수','700ml'),(50,5,'식용유 또는 버터','2 큰술'),(51,5,'다진 마늘 (선택)','1/2 큰술'),(52,6,'토마토','2개'),(53,6,'달걀','3-4개'),(54,6,'설탕','1-2큰술'),(55,6,'소금','1/2 - 1 작은 술'),(56,6,'식용유','넉넉히'),(57,6,'대파','약간'),(58,7,'두부','1모 (약 300g)'),(59,7,'돼지고기 다짐육','100g'),(60,7,'두반장','2 큰술'),(61,7,'고추기름','2 큰술'),(62,7,'다진 마늘','1 큰술'),(63,7,'다진 생강','1/2 작은술'),(64,7,'간장 (진간장)','1 큰술'),(65,7,'설탕','1/2 큰술'),(66,7,'물 또는 닭 육수','250ml'),(67,7,'대파 (다진 것)','1/2 대'),(68,7,'전분물','전분 1T + 물 2T'),(69,7,'산초(화자오) 가루','약간');
/*!40000 ALTER TABLE `recipe_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_likes`
--

DROP TABLE IF EXISTS `recipe_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_likes` (
  `like_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `recipe_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `unique_user_like` (`user_id`,`recipe_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_recipe_id` (`recipe_id`),
  CONSTRAINT `recipe_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `recipe_likes_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_likes`
--

LOCK TABLES `recipe_likes` WRITE;
/*!40000 ALTER TABLE `recipe_likes` DISABLE KEYS */;
INSERT INTO `recipe_likes` VALUES (1,4,1,'2025-11-27 08:55:21'),(12,4,4,'2025-12-01 07:57:16'),(14,4,2,'2025-12-01 08:31:42'),(15,4,5,'2025-12-01 08:36:32'),(17,4,6,'2025-12-01 08:42:07'),(18,4,7,'2025-12-01 08:49:50');
/*!40000 ALTER TABLE `recipe_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_ratings`
--

DROP TABLE IF EXISTS `recipe_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_ratings` (
  `rating_id` bigint NOT NULL AUTO_INCREMENT,
  `recipe_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `rating` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`rating_id`),
  UNIQUE KEY `unique_user_rating` (`user_id`,`recipe_id`),
  KEY `idx_recipe_id` (`recipe_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `recipe_ratings_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE,
  CONSTRAINT `recipe_ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `recipe_ratings_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_ratings`
--

LOCK TABLES `recipe_ratings` WRITE;
/*!40000 ALTER TABLE `recipe_ratings` DISABLE KEYS */;
INSERT INTO `recipe_ratings` VALUES (1,1,4,5,'2025-11-27 08:55:24','2025-11-27 08:55:24'),(2,2,4,5,'2025-11-27 09:00:08','2025-12-01 08:31:52'),(3,3,4,4,'2025-12-01 04:45:12','2025-12-01 04:45:12'),(4,4,4,5,'2025-12-01 07:57:27','2025-12-01 07:57:27'),(5,6,4,5,'2025-12-01 08:04:15','2025-12-01 08:42:14'),(6,5,4,5,'2025-12-01 08:36:46','2025-12-01 08:36:46');
/*!40000 ALTER TABLE `recipe_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_steps`
--

DROP TABLE IF EXISTS `recipe_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_steps` (
  `step_id` bigint NOT NULL AUTO_INCREMENT,
  `recipe_id` bigint NOT NULL,
  `step_number` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`step_id`),
  UNIQUE KEY `unique_recipe_step` (`recipe_id`,`step_number`),
  KEY `idx_recipe_id` (`recipe_id`),
  CONSTRAINT `recipe_steps_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_steps`
--

LOCK TABLES `recipe_steps` WRITE;
/*!40000 ALTER TABLE `recipe_steps` DISABLE KEYS */;
INSERT INTO `recipe_steps` VALUES (1,1,1,'돼지고기는 먹기 좋은 크기로 썰어 준비합니다. (밑간: 맛술, 후추 약간)\n\n김치는 속을 가볍게 털어내고 먹기 좋은 크기로 썰어줍니다.\n\n두부, 양파, 대파, 청양고추를 썰어 준비합니다.'),(2,1,2,'냄비에 참기름(또는 들기름) 1 큰술을 두르고 돼지고기를 넣고 볶습니다.\n\n고기가 반쯤 익으면 김치를 넣고 2~3분간 충분히 볶아 김치에 기름이 돌게 합니다.\n\n다진 마늘 1 큰술을 넣고 함께 볶아줍니다.'),(3,1,3,'물(또는 육수) 3컵과 김칫국물 1/2~1컵을 붓고 끓입니다.\n\n센 불에서 끓이다가 끓기 시작하면 중불로 줄여 10분 ~ 20분 이상 푹 끓여 깊은 맛을 우려냅니다. (오래 끓일수록 좋습니다.)'),(4,1,4,'고춧가루, 새우젓(또는 참치액젓), 설탕, 국간장을 넣고 섞어줍니다.\n\n양파를 넣고 한소끔 끓여줍니다.\n\n국물 맛을 보고 부족한 간은 소금이나 새우젓으로 추가합니다. (김치의 염도에 따라 간이 달라집니다.)'),(5,1,5,'두부, 대파, 청양고추를 넣고 2~3분간 더 끓여줍니다.\n\n재료가 모두 익고 국물이 원하는 농도가 되면 불을 끄고 그릇에 담아냅니다.'),(6,2,1,'재료 손질: 애호박, 감자, 양파, 두부를 먹기 좋은 크기로 썰고, 대파는 어슷 썰어 준비합니다.'),(7,2,2,'고기 볶기: 뚝배기에 차돌박이를 넣고 볶아 기름을 냅니다.'),(8,2,3,'된장 풀기: 차돌박이에 된장과 다진 마늘을 넣고 살짝 볶아 된장의 구수한 향을 살립니다.'),(9,2,4,'육수와 채소: 멸치 다시마 육수를 붓고 감자를 먼저 넣어 끓입니다.'),(10,2,5,'채소와 끓이기: 국물이 끓으면 애호박, 양파를 넣고 5분 정도 끓입니다.'),(11,2,6,'마무리: 두부, 대파, 고춧가루를 넣고 2~3분 더 끓인 후, 간을 보고 완성합니다.'),(12,3,1,'소스 준비: 볼에 계란 노른자와 간 치즈, 후추를 넉넉하게 넣고 걸쭉하고 크리미한 농도가 되도록 잘 섞어둡니다.'),(13,3,2,'면 삶기: 끓는 물(1L당 소금 1T)에 스파게티 면을 넣고 봉지에 적힌 시간보다 1~2분 짧게 (알덴테) 삶습니다.'),(14,3,3,'고기 볶기: 팬에 기름을 두르지 않고 (관찰레/베이컨 자체 기름 사용) 돼지고기를 중약불에서 노릇하게 볶아 기름을 충분히 빼줍니다. (바삭하게 익으면 불을 끕니다.)'),(15,3,4,'면 볶기: 볶은 고기와 기름이 있는 팬에 삶은 면을 넣고 면수 2~3 국자를 넣은 뒤, 중불에서 면에 기름이 코팅되도록 약 1분간 빠르게 볶습니다.'),(16,3,5,'소스 코팅 (불 끄고): 팬의 불을 끈 후 (가장 중요), 팬의 온도를 살짝 낮춥니다.'),(17,3,6,'소스 넣고 섞기: 면을 계란+치즈 소스 볼에 넣거나, 팬에 소스를 붓고 빠르게 섞어줍니다. (면수를 조금씩 넣어가며 소스가 뭉치지 않고 크리미한 농도가 되도록 조절합니다. 팬이 너무 뜨거우면 계란이 스크램블이 되니 주의!)'),(18,3,7,'마무리: 접시에 담고, 남은 볶은 고기와 통후추, 간 치즈를 뿌려 완성합니다.'),(19,4,1,'고기 핏물 제거:\n\n소고기는 키친타월로 가볍게 눌러 핏물을 제거합니다. (수입산일 경우 맛술을 뿌려 핏물을 닦아내면 좋습니다.)'),(20,4,2,'양념장 만들기:\n\n간장, 설탕, 물엿, 다진 마늘, 참기름, 맛술, 배즙(또는 물) 등 분량의 양념 재료를 볼에 넣고 설탕이 녹을 때까지 잘 섞어 양념장을 만듭니다.'),(21,4,3,'고기 재우기:\n\n핏물을 뺀 고기에 **설탕(또는 설탕+물엿)**을 먼저 넣고 주물러 연육 작용을 돕습니다.\n\n준비된 양념장을 모두 붓고 고기에 골고루 배도록 버무립니다.\n\n고기를 양념에 최소 30분 이상 냉장고에서 재워둡니다. (시간적 여유가 있다면 1~2시간 숙성하면 더욱 좋습니다.)'),(22,4,4,'채소 준비:\n\n양파, 당근, 대파, 버섯 등 채소를 썰어 준비합니다.'),(23,4,5,'볶기/끓이기:\n\n재워둔 고기에 팽이버섯을 제외한 준비된 채소를 모두 넣고 한 번 더 버무립니다.\n\n센 불로 달군 팬 또는 뚝배기에 양념된 고기와 채소를 넣고 볶습니다. (고기가 뭉치지 않도록 펴가면서 볶아줍니다.)\n\n국물 불고기를 원할 경우, 양념에 물 1/2컵 정도를 추가하여 자작하게 끓입니다.\n\n고기가 거의 다 익으면 팽이버섯을 넣고 살짝 숨이 죽을 때까지 볶아줍니다.'),(24,4,6,'마무리:\n\n맛을 보고 간이 부족하면 간장이나 올리고당을 조금 추가합니다.\n\n통깨를 뿌려 따뜻하게 그릇에 담아냅니다.'),(25,5,1,'재료 손질:\n\n돼지고기(또는 소고기)는 한 입 크기로 썰어 준비합니다.\n\n감자, 당근, 양파도 돼지고기와 비슷한 크기로 깍둑썰기합니다. (감자와 당근은 모서리를 둥글게 다듬으면 잘 부서지지 않습니다.)'),(26,5,2,'볶기:\n\n냄비에 식용유(또는 버터) 2 큰술을 두르고 **돼지고기(또는 고기)**를 넣어 볶습니다.\n\n고기가 반쯤 익으면 다진 마늘과 양파를 넣고 양파가 투명해질 때까지 볶아줍니다.\n\n감자와 당근을 넣고 약 3분간 함께 볶아줍니다.'),(27,5,3,'끓이기:\n\n물(또는 육수) 700ml를 붓고 센 불에서 끓이다가, 끓기 시작하면 중약불로 줄입니다.\n\n감자와 당근이 푹 익을 때까지 약 10~15분 정도 끓여줍니다. (채소가 바닥에 눌어붙지 않도록 가끔 저어줍니다.)'),(28,5,4,'카레 넣고 농도 맞추기:\n\n불을 끄거나 약불로 줄인 후, 시판 카레 가루를 넣고 덩어리가 지지 않게 잘 풀어줍니다. (고형 카레일 경우 잘게 잘라 넣어줍니다.)\n\n다시 중약불로 올리고 5분 정도 더 끓여 원하는 농도가 되도록 조절합니다. (농도가 너무 묽으면 카레를 더 넣고, 너무 진하면 물을 추가합니다.)'),(29,5,5,'마무리:\n\n따뜻한 밥 위에 카레를 듬뿍 얹어 완성합니다.'),(30,6,1,'재료 손질:\n\n토마토는 꼭지를 제거하고 먹기 좋은 크기(약 2~3cm)로 썰어줍니다.\n\n달걀은 그릇에 깨서 소금 1/3 작은술을 넣고 잘 풀어줍니다. (젓가락으로 빠르게 저어주세요.)\n\n(선택) 대파 흰 부분을 다지거나 썰어 준비합니다.'),(31,6,2,'달걀 볶기 (스크램블):\n\n팬에 식용유를 넉넉하게 두르고 센 불로 달굽니다.\n\n풀어둔 달걀물을 붓고, 재빨리 젓가락으로 휘저어 부드러운 스크램블 에그를 만듭니다.\n\n달걀이 80% 정도 익었을 때 불을 끄고 다른 그릇에 덜어둡니다. (너무 오래 익히면 질겨집니다.)'),(32,6,3,'토마토 볶기:\n\n팬에 식용유를 다시 약간 두르고, (선택) 대파를 먼저 넣어 파기름을 냅니다.\n\n썰어둔 토마토를 넣고 중불에서 볶아줍니다. 토마토가 물러지면서 즙이 나오기 시작하면 설탕과 남은 소금을 넣고 약 1분간 더 볶습니다.\n\n(토마토가 살짝 물컹해지고 소스가 되는 느낌이 들면 됩니다.)'),(33,6,4,'합치기 및 마무리:\n\n미리 덜어두었던 스크램블 에그를 토마토 소스에 다시 넣고 강불에서 30초~1분 이내로 빠르게 섞어줍니다.\n\n달걀이 토마토의 수분을 살짝 흡수하고 전체적으로 잘 섞이면 바로 불을 끄고 완성합니다.'),(34,7,1,'두부 준비:\n\n두부는 깍둑썰기(1.5~2cm) 합니다. 끓는 물에 소금 약간을 넣고 두부를 데치면 잘 부서지지 않습니다. (약 1분 후 건져 물기 제거)'),(35,7,2,'고기 볶기:\n\n팬에 고추기름 2T를 두르고 다진 마늘, 다진 생강을 넣어 약불에서 향을 냅니다.\n\n돼지고기 다짐육을 넣고 센 불에서 볶다가, 고기가 익으면 두반장 2T를 넣고 함께 볶아 고기에 양념이 배도록 합니다.'),(36,7,3,'소스 끓이기:\n\n물(또는 육수) 250ml, 간장 1T, 설탕 1/2T를 넣고 끓입니다.\n\n국물이 끓으면 데친 두부를 넣고 양념이 잘 배도록 중불에서 5분 정도 끓여줍니다.'),(37,7,4,'농도 및 마무리:\n\n국물이 자작해지면 전분물을 조금씩 넣으면서 빠르게 저어 원하는 농도를 맞춥니다.\n\n불을 끄고 다진 대파를 넣고 섞습니다.'),(38,7,5,'그릇에 담은 후, 취향에 따라 산초(화자오) 가루를 뿌려 얼얼한 맛을 더해 완성합니다.');
/*!40000 ALTER TABLE `recipe_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_tags`
--

DROP TABLE IF EXISTS `recipe_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_tags` (
  `tag_id` bigint NOT NULL AUTO_INCREMENT,
  `recipe_id` bigint NOT NULL,
  `tag_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`tag_id`),
  KEY `idx_recipe_id` (`recipe_id`),
  KEY `idx_tag_name` (`tag_name`),
  CONSTRAINT `recipe_tags_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_tags`
--

LOCK TABLES `recipe_tags` WRITE;
/*!40000 ALTER TABLE `recipe_tags` DISABLE KEYS */;
INSERT INTO `recipe_tags` VALUES (1,1,'밥도둑'),(2,1,'김치'),(3,1,'묵은지'),(4,1,'돼지고기'),(5,2,'뚝배기'),(6,2,'차돌박이'),(7,2,'구수한맛'),(8,2,'밥도둑'),(9,3,'크림X'),(10,3,'노른자소스'),(11,3,'파스타'),(12,4,'소고기요리'),(13,4,'손님접대'),(14,4,'궁중요리'),(15,4,'밥도둑'),(16,5,'집밥'),(17,5,'간편요리'),(18,5,'카레'),(19,5,'아이반찬'),(20,6,'중국가정식'),(21,6,'간단볶음'),(22,7,'사천요리'),(23,7,'마라'),(24,7,'두부요리');
/*!40000 ALTER TABLE `recipe_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `recipe_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `main_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` enum('EASY','HARD','MEDIUM') COLLATE utf8mb4_unicode_ci NOT NULL,
  `cooking_time` int NOT NULL,
  `servings` int DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `view_count` int DEFAULT '0',
  `like_count` int DEFAULT '0',
  `comment_count` int DEFAULT '0',
  `save_count` int DEFAULT '0',
  `rating_sum` int DEFAULT '0',
  `rating_count` int DEFAULT '0',
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `is_ai_generated` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`recipe_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_view_count` (`view_count`),
  KEY `idx_like_count` (`like_count`),
  KEY `idx_average_rating` (`average_rating`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_category` (`category`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1,4,'김치찌개','잘 익은 신김치와 돼지고기를 넉넉하게 넣고 푹 끓여 깊고 진한 맛을 내는 한국의 대표적인 찌개 요리입니다. 돼지고기의 감칠맛과 김치의 시원한 신맛이 어우러져 밥상 위의 밥도둑 역할을 톡톡히 합니다. 오래 끓일수록 재료의 풍미가 국물에 우러나와 더욱 맛있어집니다.','http://localhost:8080/api/images/19fed25a-3f4a-4126-b553-6789102607b4.jpg','MEDIUM',40,3,'한식',7,1,1,0,5,1,5.00,0,'2025-11-27 08:55:09','2025-12-01 07:24:11'),(2,4,'차돌박이 된장찌개','구수한 된장 국물에 차돌박이의 기름진 고소함이 더해져 깊은 맛을 내는 찌개입니다. 각종 채소와 두부를 넣고 끓여 영양도 풍부하며, 한국인의 식탁에서 빠질 수 없는 메뉴입니다.','http://localhost:8080/api/images/ae043266-18c6-4b52-9539-c2bed2f0eb74.jpg','EASY',25,2,'한식',9,1,1,1,5,1,5.00,0,'2025-11-27 08:59:56','2025-12-01 08:32:14'),(3,4,'이탈리아 정통 까르보나라','정통 까르보나라는 생크림이나 우유 없이 계란 노른자, 치즈(파르미지아노 레지아노 또는 페코리노 로마노), 돼지고기(관찰레 또는 판체타), 후추만을 사용해 만드는 파스타입니다. 면의 열기로 소스를 익혀 꾸덕하고 고소한 맛이 특징입니다.','http://localhost:8080/api/images/3900586b-9202-4ce2-9564-bbf66e863b13.jpg','MEDIUM',20,1,'양식',6,0,0,0,4,1,4.00,0,'2025-11-27 09:03:46','2025-12-01 08:46:08'),(4,5,'소불고기','얇게 썬 소고기를 간장, 설탕 등으로 만든 달콤하고 짭짤한 양념에 재워 채소와 함께 볶거나 전골처럼 끓여 먹는 한국의 대표적인 전통 요리입니다. 부드러운 식감과 감칠맛이 특징이며, 밥반찬이나 손님 접대 음식으로 인기가 높습니다.','http://localhost:8080/api/images/bb1ee137-b266-418b-b098-05e2be9e5d70.jpg','MEDIUM',40,2,'한식',10,1,1,1,5,1,5.00,0,'2025-11-27 09:08:57','2025-12-01 08:46:02'),(5,5,'카레라이스','강황과 다양한 향신료로 만든 카레 가루를 물에 풀어 감자, 당근, 고기 등의 재료와 함께 끓여 밥 위에 얹어 먹는 일품 요리입니다. 영양도 풍부하고 조리법이 간단하여 온 가족이 즐겨 먹는 메뉴입니다.','http://localhost:8080/api/images/62555eb8-3cce-4c5e-be25-9345292753e9.jpg','EASY',30,3,'일식',3,1,1,1,5,1,5.00,0,'2025-11-27 09:12:14','2025-12-01 08:37:08'),(6,4,'토마토 달걀 볶음','토마토의 새콤함과 달걀의 부드러움이 어우러진 중국의 대표적인 가정식 요리입니다. 달걀을 부드럽게 스크램블 하여 준비한 뒤, 토마토를 볶아 만든 소스에 버무려냅니다. 재료가 간단하고 조리 시간이 짧아 부담 없이 만들 수 있습니다.','http://localhost:8080/api/images/1df5c05a-916d-47f9-9752-6ca79a032ea4.jpg','EASY',10,2,'중식',4,1,1,1,5,1,5.00,0,'2025-12-01 08:03:56','2025-12-01 08:42:27'),(7,4,'마파두부','사천(쓰촨) 요리를 대표하는 메뉴로, 다진 돼지고기와 부드러운 두부를 두반장(豆瓣醬)과 고추기름, 산초(화자오, 花椒)를 활용한 매콤하고 얼얼한 소스에 끓여낸 요리입니다. 밥과 함께 먹으면 훌륭한 한 그릇 요리가 됩니다','http://localhost:8080/api/images/1e2f3af7-5eb1-4885-a6e2-f6399844a5ec.jpg','EASY',24,2,'중식',2,1,0,1,0,0,0.00,0,'2025-12-01 08:49:46','2025-12-01 08:50:00');
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refrigerator_items`
--

DROP TABLE IF EXISTS `refrigerator_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refrigerator_items` (
  `item_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `ingredient_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purchase_date` date DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `storage_method` enum('FREEZER','FRIDGE','ROOM_TEMP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('EXPIRED','FRESH','NORMAL','WARNING') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memo` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`item_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expiration_date` (`expiration_date`),
  CONSTRAINT `refrigerator_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refrigerator_items`
--

LOCK TABLES `refrigerator_items` WRITE;
/*!40000 ALTER TABLE `refrigerator_items` DISABLE KEYS */;
INSERT INTO `refrigerator_items` VALUES (1,1,'양파','2개','2025-11-20','2025-12-05','ROOM_TEMP','FRESH','채소',NULL,'2025-11-27 17:41:18','2025-11-27 17:41:18'),(2,1,'당근','500g','2025-11-21','2025-12-01','FRIDGE','NORMAL','채소',NULL,'2025-11-27 17:41:18','2025-11-27 17:41:18'),(3,1,'달걀','10개','2025-11-22','2025-11-30','FRIDGE','WARNING','유제품',NULL,'2025-11-27 17:41:18','2025-11-27 17:41:18'),(4,1,'우유','1L','2025-11-23','2025-11-29','FRIDGE','WARNING','유제품',NULL,'2025-11-27 17:41:18','2025-11-27 17:41:18'),(5,1,'돼지고기','300g','2025-11-24','2025-11-27','FRIDGE','FRESH','육류',NULL,'2025-11-27 17:41:18','2025-11-27 17:41:18'),(6,2,'감자','1kg','2025-11-20','2025-12-10','ROOM_TEMP','FRESH','채소',NULL,'2025-11-27 17:41:18','2025-11-27 17:41:18'),(7,2,'토마토','5개','2025-11-22','2025-11-28','FRIDGE','NORMAL','채소',NULL,'2025-11-27 17:41:18','2025-11-27 17:41:18'),(8,2,'닭고기','500g','2025-11-24','2025-11-27','FRIDGE','WARNING','육류',NULL,'2025-11-27 17:41:18','2025-11-27 17:41:18'),(9,5,'양파','3개','2025-11-25','2025-12-02','FRIDGE','NORMAL','채소',NULL,'2025-11-27 09:14:26','2025-11-27 09:14:26'),(10,5,'대파','1대','2025-11-22','2025-11-29','FRIDGE','WARNING','채소',NULL,'2025-11-27 09:15:06','2025-11-27 09:15:06'),(11,5,'감자','4개','2025-11-28','2025-12-05','ROOM_TEMP','NORMAL','채소',NULL,'2025-11-27 09:16:34','2025-11-27 09:16:38'),(12,5,'당근','1/2개','2025-11-23','2025-11-30','FRIDGE','WARNING','채소',NULL,'2025-11-27 09:17:18','2025-11-27 09:17:18'),(36,4,'계란 특란','8개','2025-11-24','2025-12-01','FRIDGE','EXPIRED','유제품/계란','유정란','2025-12-01 06:38:17','2025-12-01 06:38:17'),(38,4,'멸치볶음','200g','2025-11-05','2025-12-05','FRIDGE','WARNING','가공식품','빨리 먹어야 하는 것','2025-12-01 06:41:52','2025-12-01 06:41:52'),(39,4,'닭가슴살','1kg','2025-10-05','2026-04-05','FREEZER','FRESH','육류','다이어트 용','2025-12-01 06:43:43','2025-12-01 06:43:43'),(40,4,'낙지','3kg','2025-11-30','2025-12-07','FREEZER','NORMAL','해산물','빨리 상할 수 있음','2025-12-01 06:44:45','2025-12-01 06:44:45'),(41,4,'알배추','250g','2025-11-20','2025-12-04','FRIDGE','WARNING','채소','다이어트용','2025-12-01 06:46:25','2025-12-01 06:46:25'),(42,4,'땅콩','100g','2024-11-30','2025-11-30','FRIDGE','EXPIRED','기타',NULL,'2025-12-01 06:50:39','2025-12-01 07:17:51'),(43,4,'차돌박이','250g','2025-12-01','2025-12-15','FREEZER','FRESH','육류','얻어온 고기','2025-12-01 07:20:52','2025-12-01 07:22:19'),(44,4,'신김치','1포기','2025-11-24','2025-12-24','FRIDGE','FRESH','가공식품',NULL,'2025-12-01 07:23:59','2025-12-01 07:23:59'),(56,4,'스테비아 토마토 팩 ','2개','2025-10-31','2025-11-07','FRIDGE','EXPIRED','과일',NULL,'2025-12-01 08:43:56','2025-12-01 08:43:56'),(57,4,'산지 그대로 사과 46 ','2개','2025-10-31','2025-11-14','FRIDGE','EXPIRED','과일',NULL,'2025-12-01 08:43:56','2025-12-01 08:43:56'),(58,4,'강된장 보리 비빔밥 ','2개','2025-10-31','2026-10-31','FRIDGE','FRESH','가공식품',NULL,'2025-12-01 08:43:56','2025-12-01 08:43:56'),(59,4,'컵반 돼지 김치 찌개 밥 ','2개','2025-10-31','2026-10-31','FRIDGE','FRESH','가공식품',NULL,'2025-12-01 08:43:56','2025-12-01 08:43:56'),(60,4,'매일 바이오 백도 ','2개','2025-10-31','2026-10-31','FRIDGE','FRESH','기타',NULL,'2025-12-01 08:43:56','2025-12-01 08:43:56');
/*!40000 ALTER TABLE `refrigerator_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_recipes`
--

DROP TABLE IF EXISTS `saved_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_recipes` (
  `saved_recipe_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `recipe_id` bigint NOT NULL,
  `saved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`saved_recipe_id`),
  UNIQUE KEY `unique_user_recipe` (`user_id`,`recipe_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_recipe_id` (`recipe_id`),
  CONSTRAINT `saved_recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `saved_recipes_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_recipes`
--

LOCK TABLES `saved_recipes` WRITE;
/*!40000 ALTER TABLE `saved_recipes` DISABLE KEYS */;
INSERT INTO `saved_recipes` VALUES (6,4,4,'2025-12-01 07:57:17'),(8,4,2,'2025-12-01 08:31:44'),(9,4,5,'2025-12-01 08:36:35'),(11,4,6,'2025-12-01 08:42:07'),(12,4,7,'2025-12-01 08:49:51');
/*!40000 ALTER TABLE `saved_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `google_id` (`google_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_google_id` (`google_id`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'google_test_001','user1@example.com','김철수','2025-11-27 17:41:18','2025-11-27 17:41:18'),(2,'google_test_002','user2@example.com','이영희','2025-11-27 17:41:18','2025-11-27 17:41:18'),(3,'google_test_003','user3@example.com','박민수','2025-11-27 17:41:18','2025-11-27 17:41:18'),(4,'103714591072517700725','jsh147301@gmail.com','전성현 (새싹)','2025-11-27 08:52:48','2025-11-27 08:52:48'),(5,'103543629124834867900','jsh147301@chungbuk.ac.kr','전성현','2025-11-27 09:04:09','2025-11-27 09:04:09');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-02 13:51:18
