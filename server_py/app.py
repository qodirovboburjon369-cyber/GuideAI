# from flask import Flask, request, jsonify, Response
# from flask_cors import CORS
# from dotenv import load_dotenv
# from PIL import Image
# import os
# import base64
# import requests
# import io

# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# MUXLISA_API_KEY = os.getenv("MUXLISA_API_KEY")


# def resize_image(image_bytes, mimetype, max_size=800):
#     img = Image.open(io.BytesIO(image_bytes))
#     img.thumbnail((max_size, max_size))
#     output = io.BytesIO()
#     fmt = "JPEG" if "jpeg" in mimetype or "jpg" in mimetype else "PNG"
#     img.save(output, format=fmt, quality=85)
#     return output.getvalue(), f"image/{fmt.lower()}"


# def get_prompt(lang):
#     if lang == "uz":
#         return """Bu rasmda qaysi joy tasvirlanganini aniqlang.
# Agar joy mashhur yoki tarixiy bolsa, quyidagi malumotlarni oddiy va tushunarli matn shaklida yozing:
# Joy nomi, qayerda joylashgan, tarixi, qachon qurilgan, memoriy uslubi, qiziqarli faktlar, turistlar uchun maslahatlar.
# Faqat oddiy matn yozing, hech qanday maxsus belgilar ishlatmang.
# Javobni faqat OZBEK tilida yozing."""

#     elif lang == "en":
#         return """Identify the place in this image.
# If it is famous or historical, write the following in plain text:
# Name, location, history, when it was built, architectural style, interesting facts, tips for tourists.
# Write plain text only, no special characters.
# Write the answer in ENGLISH only."""

#     elif lang == "ru":
#         return """Определите место на этом изображении.
# Если это известное или историческое место, напишите следующее простым текстом:
# Название, местонахождение, история, когда построено, архитектурный стиль, интересные факты, советы туристам.
# Пишите только простым текстом, без специальных символов, без списков и точек.
# Каждую мысль пишите отдельным предложением.
# Напишите ответ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ."""

#     elif lang == "zh":
#         return """请识别这张图片中的地方。
# 如果是著名的历史或旅游景点，请用简洁的中文写出以下内容：
# 地点名称、所在位置、历史背景、建造时间、建筑风格、有趣的事实、对游客的建议。
# 只写纯文本，不要使用特殊符号、列表或标题。
# 请只用中文回答。"""

#     return ""


# @app.route("/analyze-image", methods=["POST"])
# def analyze_image():
#     try:
#         if "image" not in request.files:
#             return jsonify({"description": "No image uploaded"})

#         file = request.files["image"]
#         lang = request.form.get("lang", "uz")
#         image_bytes = file.read()

#         resized_bytes, mime = resize_image(image_bytes, file.mimetype)
#         image_b64 = base64.b64encode(resized_bytes).decode("utf-8")

#         response = requests.post(
#             "https://api.groq.com/openai/v1/chat/completions",
#             headers={
#                 "Authorization": f"Bearer {GROQ_API_KEY}",
#                 "Content-Type": "application/json"
#             },
#             json={
#                 "model": "meta-llama/llama-4-scout-17b-16e-instruct",
#                 "messages": [
#                     {
#                         "role": "user",
#                         "content": [
#                             {"type": "text", "text": get_prompt(lang)},
#                             {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{image_b64}"}}
#                         ]
#                     }
#                 ],
#                 "max_tokens": 4000
#             }
#         )

#         data = response.json()
#         print("GROQ RESPONSE:", data)
#         text = data["choices"][0]["message"]["content"]
#         return jsonify({"description": text})

#     except Exception as e:
#         print("ERROR:", e)
#         return jsonify({"description": "AI error"})


# @app.route("/speak", methods=["POST"])
# def speak():
#     try:
#         data = request.get_json()
#         text = data.get("text", "")
#         lang = data.get("lang", "uz")

#         print(f"SPEAK: lang={lang}, text_len={len(text)}")

#         if not text:
#             return jsonify({"error": "No text provided"}), 400

#         # Faqat O'zbek va Rus uchun Muxlisa
#         # Ingliz va Xitoy brauzer TTS bilan ishlaydi (frontend da)
#         if lang in ("en", "zh"):
#             return jsonify({"error": "Use browser TTS for this language"}), 400

#         print("Using Muxlisa...")
#         speaker = 0 if lang == "ru" else 1
#         chunks = [text[i:i+500] for i in range(0, len(text), 500)]

#         audio_parts = []
#         for chunk in chunks:
#             response = requests.post(
#                 "https://service.muxlisa.uz/api/v2/tts",
#                 headers={
#                     "Content-Type": "application/json",
#                     "x-api-key": MUXLISA_API_KEY
#                 },
#                 json={"text": chunk, "speaker": speaker}
#             )
#             if response.status_code == 200:
#                 audio_parts.append(response.content)
#             else:
#                 print("MUXLISA ERROR:", response.text)

#         full_audio = b"".join(audio_parts)
#         return Response(full_audio, mimetype="audio/mpeg")

#     except Exception as e:
#         print("SPEAK ERROR:", e)
#         return jsonify({"error": "Server error"}), 500


# if __name__ == "__main__":
#     app.run(port=5000, debug=True)



from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image
import os
import base64
import requests
import io

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MUXLISA_API_KEY = os.getenv("MUXLISA_API_KEY")


def resize_image(image_bytes, mimetype, max_size=800):
    img = Image.open(io.BytesIO(image_bytes))
    img.thumbnail((max_size, max_size))
    output = io.BytesIO()
    fmt = "JPEG" if "jpeg" in mimetype or "jpg" in mimetype else "PNG"
    img.save(output, format=fmt, quality=85)
    return output.getvalue(), f"image/{fmt.lower()}"


def get_prompt(lang, is_image=False, extra_text=""):
    if lang == "uz":
        if is_image:
            return """Bu rasmda qaysi joy tasvirlanganini aniqlang.
Agar joy mashhur yoki tarixiy bolsa, quyidagi malumotlarni oddiy va tushunarli matn shaklida yozing:
Joy nomi, qayerda joylashgan, tarixi, qachon qurilgan, memoriy uslubi, qiziqarli faktlar, turistlar uchun maslahatlar.
Faqat oddiy matn yozing, hech qanday maxsus belgilar ishlatmang.
Javobni faqat OZBEK tilida yozing."""
        else:
            return f"""Foydalanuvchi "{extra_text}" haqida savoldir.
Agar bu mashhur yoki tarixiy joy nomi bolsa, uning haqida batafsil ma'lumot bering: 
Joy nomi, qayerda joylashgan, tarixi, qachon qurilgan, memoriy uslubi, qiziqarli faktlar, turistlar uchun maslahatlar.
Faqat oddiy matn yozing, hech qanday maxsus belgilar ishlatmang.
Javobni faqat OZBEK tilida yozing."""

    elif lang == "en":
        if is_image:
            return """Identify the place in this image.
If it is famous or historical, write the following in plain text:
Name, location, history, when it was built, architectural style, interesting facts, tips for tourists.
Write plain text only, no special characters.
Write the answer in ENGLISH only."""
        else:
            return f"""The user is asking about "{extra_text}".
If this is a famous or historical place, provide detailed information:
Name, location, history, when it was built, architectural style, interesting facts, tips for tourists.
Write plain text only, no special characters.
Write the answer in ENGLISH only."""

    elif lang == "ru":
        if is_image:
            return """Определите место на этом изображении.
Если это известное или историческое место, напишите следующее простым текстом:
Название, местонахождение, история, когда построено, архитектурный стиль, интересные факты, советы туристам.
Пишите только простым текстом, без специальных символов, без списков и точек.
Каждую мысль пишите отдельным предложением.
Напишите ответ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ."""
        else:
            return f"""Пользователь спрашивает о "{extra_text}".
Если это известное или историческое место, предоставьте подробную информацию:
Название, местонахождение, история, когда построено, архитектурный стиль, интересные факты, советы туристам.
Пишите только простым текстом, без специальных символов, без списков и точек.
Напишите ответ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ."""

    elif lang == "zh":
        if is_image:
            return """请识别这张图片中的地方。
如果是著名的历史或旅游景点，请用简洁的中文写出以下内容：
地点名称、所在位置、历史背景、建造时间、建筑风格、有趣的事实、对游客的建议。
只写纯文本，不要使用特殊符号、列表或标题。
请只用中文回答。"""
        else:
            return f"""用户询问关于"{extra_text}"的问题。
如果这是一个著名的或历史上的地点，请提供详细信息：
地点名称、所在位置、历史背景、建造时间、建筑风格、有趣的事实、对游客的建议。
只写纯文本，不要使用特殊符号、列表或标题。
请只用中文回答。"""

    return ""


@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    """Original endpoint - for image-only analysis"""
    try:
        if "image" not in request.files:
            return jsonify({"description": "No image uploaded"})

        file = request.files["image"]
        lang = request.form.get("lang", "uz")
        image_bytes = file.read()

        resized_bytes, mime = resize_image(image_bytes, file.mimetype)
        image_b64 = base64.b64encode(resized_bytes).decode("utf-8")

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "meta-llama/llama-4-scout-17b-16e-instruct",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": get_prompt(lang, is_image=True)},
                            {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{image_b64}"}}
                        ]
                    }
                ],
                "max_tokens": 4000
            }
        )

        data = response.json()
        print("GROQ RESPONSE:", data)
        text = data["choices"][0]["message"]["content"]
        return jsonify({"description": text})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"description": "AI error"})


@app.route("/analyze-hybrid", methods=["POST"])
def analyze_hybrid():
    """Hybrid endpoint - handles both text and image inputs"""
    try:
        analysis_type = request.form.get("type", "text")
        lang = request.form.get("lang", "uz")
        
        if analysis_type == "image":
            if "image" not in request.files:
                return jsonify({"description": "No image uploaded"})
            
            file = request.files["image"]
            image_bytes = file.read()
            resized_bytes, mime = resize_image(image_bytes, file.mimetype)
            image_b64 = base64.b64encode(resized_bytes).decode("utf-8")
            
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "meta-llama/llama-4-scout-17b-16e-instruct",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": get_prompt(lang, is_image=True)},
                                {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{image_b64}"}}
                            ]
                        }
                    ],
                    "max_tokens": 4000
                }
            )
        else:  # text analysis
            user_text = request.form.get("text", "")
            if not user_text:
                return jsonify({"description": "No text provided"})
            
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "meta-llama/llama-4-scout-17b-16e-instruct",
                    "messages": [
                        {
                            "role": "user",
                            "content": get_prompt(lang, is_image=False, extra_text=user_text)
                        }
                    ],
                    "max_tokens": 4000
                }
            )
        
        data = response.json()
        print("GROQ RESPONSE:", data)
        text = data["choices"][0]["message"]["content"]
        return jsonify({"description": text})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"description": "AI error"})


@app.route("/speak", methods=["POST"])
def speak():
    try:
        data = request.get_json()
        text = data.get("text", "")
        lang = data.get("lang", "uz")

        print(f"SPEAK: lang={lang}, text_len={len(text)}")

        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Faqat O'zbek va Rus uchun Muxlisa
        # Ingliz va Xitoy brauzer TTS bilan ishlaydi (frontend da)
        if lang in ("en", "zh"):
            return jsonify({"error": "Use browser TTS for this language"}), 400

        print("Using Muxlisa...")
        speaker = 0 if lang == "ru" else 1
        chunks = [text[i:i+500] for i in range(0, len(text), 500)]

        audio_parts = []
        for chunk in chunks:
            response = requests.post(
                "https://service.muxlisa.uz/api/v2/tts",
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": MUXLISA_API_KEY
                },
                json={"text": chunk, "speaker": speaker}
            )
            if response.status_code == 200:
                audio_parts.append(response.content)
            else:
                print("MUXLISA ERROR:", response.text)

        full_audio = b"".join(audio_parts)
        return Response(full_audio, mimetype="audio/mpeg")

    except Exception as e:
        print("SPEAK ERROR:", e)
        return jsonify({"error": "Server error"}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)