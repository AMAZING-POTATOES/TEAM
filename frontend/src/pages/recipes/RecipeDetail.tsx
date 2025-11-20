import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRecipeDetail,
  incrementViewCount,
  getInteractionStatus,
  likeRecipe,
  unlikeRecipe,
  saveRecipe,
  unsaveRecipe,
  rateRecipe,
  getMyRating,
  getComments,
  addComment,
  deleteComment,
  type RecipeDetail as RecipeDetailType,
  type RecipeComment,
  type PageResponse
} from "../../api/recipe";
import { useAuth } from "../../app/AuthProvider";
import RecipeRating from "../../components/RecipeRating";
import Tag from "../../components/Tag";

type Tab = "ingredients" | "steps";

// 난이도 매핑
const difficultyMap: Record<string, string> = {
  EASY: "쉬움",
  MEDIUM: "보통",
  HARD: "어려움",
};

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { user } = useAuth();

  console.log("🎯 RecipeDetail 컴포넌트 렌더링 - ID:", id);

  const [data, setData] = useState<RecipeDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Tab>("ingredients");

  // 상호작용 상태
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);

  // 별점 상태
  const [myRating, setMyRating] = useState<number>(0);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // 댓글 상태
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const btnIngRef = useRef<HTMLButtonElement>(null);
  const btnStepRef = useRef<HTMLButtonElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const fetchRecipe = async () => {
      if (!id) return;

      try {
        console.log("🔄 RecipeDetail: 레시피 로딩 시작...", id);
        console.log("👤 RecipeDetail: 현재 사용자:", user);
        setLoading(true);
        setError(null);

        const recipeId = parseInt(id, 10);

        // ID가 유효한 숫자인지 확인
        if (isNaN(recipeId)) {
          throw new Error("잘못된 레시피 ID입니다.");
        }

        // 레시피 상세 조회
        const recipe = await getRecipeDetail(recipeId);

        // 조회수 증가
        await incrementViewCount(recipeId).catch(() => {
          console.warn("조회수 증가 실패 (무시)");
        });

        if (mounted) {
          setData(recipe);
          setLikeCount(recipe.likeCount);
          setSaveCount(recipe.saveCount);
          console.log("✅ RecipeDetail: 레시피 수신 성공:", recipe.title);

          // 로그인한 경우 상호작용 상태 조회
          if (user) {
            try {
              const interactionStatus = await getInteractionStatus(recipeId);
              setLiked(interactionStatus.liked);
              setSaved(interactionStatus.saved);
              console.log("✅ RecipeDetail: 상호작용 상태 조회 성공:", interactionStatus);
            } catch (err) {
              console.warn("상호작용 상태 조회 실패 (무시):", err);
            }

            // 내 별점 조회
            try {
              const ratingData = await getMyRating(recipeId);
              if (ratingData) {
                setMyRating(ratingData.rating);
              }
            } catch (err) {
              console.warn("별점 조회 실패 (무시):", err);
            }
          }

          // 댓글 조회 (로그인 여부와 관계없이)
          try {
            const commentsData = await getComments(recipeId, 0, 20);
            setComments(commentsData.content);
          } catch (err) {
            console.warn("댓글 조회 실패 (무시):", err);
          }

          requestAnimationFrame(() =>
            topRef.current?.scrollIntoView({ behavior: "smooth" })
          );
        }
      } catch (err) {
        console.error("❌ RecipeDetail: 레시피 로딩 실패:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "레시피를 불러오는데 실패했습니다.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRecipe();

    return () => {
      mounted = false;
    };
  }, [id, user]);

  useEffect(() => {
    const ingEl = ingredientsRef.current;
    const stepEl = stepsRef.current;
    if (!ingEl || !stepEl) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const k = e.target.getAttribute("data-observe-id");
            if (k === "ingredients") setActive("ingredients");
            if (k === "steps") setActive("steps");
          }
        });
      },
      { root: null, threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
    );
    obs.observe(ingEl);
    obs.observe(stepEl);
    return () => obs.disconnect();
  }, [data]);

  const updateIndicator = () => {
    const wrap = wrapRef.current;
    const ind = indicatorRef.current;
    const target = active === "ingredients" ? btnIngRef.current : btnStepRef.current;
    if (!wrap || !ind || !target) return;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = target.getBoundingClientRect();

    const pad = 6;
    const height = wrap.clientHeight - pad * 2;
    const width = btnRect.width; // 버튼 너비만큼
    const left = btnRect.left - wrapRect.left;

    ind.style.height = `${height}px`;
    ind.style.width = `${width}px`;
    ind.style.transform = `translateX(${left}px)`;
  };

  useLayoutEffect(() => {
    updateIndicator();
  }, [active]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    setTimeout(updateIndicator, 0);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = (tab: Tab) => {
    const el = tab === "ingredients" ? ingredientsRef.current : stepsRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(tab);
  };

  const ratingText = useMemo(() => {
    if (!data?.averageRating) return null;
    return {
      r: data.averageRating.toFixed(1),
      cnt: undefined, // 백엔드에서 ratingCount가 없음
    };
  }, [data]);

  // 좋아요 핸들러
  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!id) return;

    try {
      const recipeId = parseInt(id, 10);
      if (liked) {
        const result = await unlikeRecipe(recipeId);
        setLiked(false);
        setLikeCount(result.likeCount);
      } else {
        const result = await likeRecipe(recipeId);
        setLiked(true);
        setLikeCount(result.likeCount);
      }
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  // 저장하기 핸들러
  const handleSave = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!id) return;

    try {
      const recipeId = parseInt(id, 10);
      if (saved) {
        const result = await unsaveRecipe(recipeId);
        setSaved(false);
        setSaveCount(result.saveCount);
      } else {
        const result = await saveRecipe(recipeId);
        setSaved(true);
        setSaveCount(result.saveCount);
      }
    } catch (err) {
      console.error('저장 처리 실패:', err);
      alert('저장 처리에 실패했습니다.');
    }
  };

  // 별점 등록 핸들러
  const handleRating = async (rating: number) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!id) return;

    try {
      const recipeId = parseInt(id, 10);
      await rateRecipe(recipeId, rating);
      setMyRating(rating);
      setShowRatingModal(false);

      // 레시피 데이터 다시 로드해서 평균 별점 업데이트
      const recipe = await getRecipeDetail(recipeId);
      setData(recipe);
    } catch (err) {
      console.error('별점 등록 실패:', err);
      alert('별점 등록에 실패했습니다.');
    }
  };

  // 댓글 작성 핸들러
  const handleAddComment = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!id || !commentText.trim()) return;

    try {
      const recipeId = parseInt(id, 10);
      const newComment = await addComment(recipeId, commentText);
      setComments([newComment, ...comments]);
      setCommentText("");

      // 댓글 수 업데이트를 위해 레시피 데이터 다시 로드
      const recipe = await getRecipeDetail(recipeId);
      setData(recipe);
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: number) => {
    if (!user || !id) return;

    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const recipeId = parseInt(id, 10);
      await deleteComment(recipeId, commentId);
      setComments(comments.filter(c => c.commentId !== commentId));

      // 댓글 수 업데이트를 위해 레시피 데이터 다시 로드
      const recipe = await getRecipeDetail(recipeId);
      setData(recipe);
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 로딩 상태
  if (loading) {
    console.log("📍 RecipeDetail: 로딩 상태 렌더링");
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="inline-block w-12 h-12 border-4 border-t-transparent border-[#4CAF50] rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">레시피를 불러오는 중...</p>
        <p className="mt-2 text-xs text-gray-400">ID: {id}</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">레시피를 불러올 수 없습니다</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[#4CAF50] text-white hover:opacity-90"
            >
              다시 시도
            </button>
            <button
              onClick={() => nav(-1)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없음
  if (!data) {
    return null;
  }

  return (
    <div ref={topRef} className="mx-auto max-w-4xl px-6 py-10">
      {data.mainImageUrl ? (
        <div className="h-[320px] w-full overflow-hidden rounded-2xl bg-gray-100">
          <img src={data.mainImageUrl} alt={data.title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="h-[320px] w-full rounded-2xl bg-gray-100 flex items-center justify-center text-8xl">
          🍳
        </div>
      )}

      <header className="mt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[26px] font-bold">{data.title}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                liked
                  ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {liked ? "❤️" : "🤍"} {likeCount}
            </button>
            <button
              onClick={handleSave}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                saved
                  ? "border-[#4CAF50] bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50]/20"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {saved ? "📌 저장됨" : "저장하기"}
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-500">
          {data.authorName && <span>작성자 {data.authorName}</span>}
          {data.authorName && <span>•</span>}
          <span>⏱ {data.cookingTime}분</span>
          <span>•</span>
          <span>{difficultyMap[data.difficulty] || data.difficulty}</span>
          {data.servings && (
            <>
              <span>•</span>
              <span>{data.servings}인분</span>
            </>
          )}
          {ratingText && (
            <>
              <span>•</span>
              <RecipeRating value={data.averageRating ?? 0} />
              {ratingText.cnt && <span className="text-sm text-gray-400">{ratingText.cnt}명 참여</span>}
            </>
          )}
        </div>

        {data.description && (
          <p className="mt-3 text-gray-600">{data.description}</p>
        )}

        {!!data.tags?.length && (
          <div className="mt-2 flex flex-wrap gap-2">
            {data.tags.map((t, idx) => {
              const tagText = typeof t === 'string' ? t : t.tagName;
              return <Tag key={`${tagText}-${idx}`} text={tagText} />;
            })}
          </div>
        )}
      </header>

      <div
        ref={wrapRef}
        className="relative mt-6 flex items-center rounded-full bg-[#4CAF50]/10 p-[6px] ring-1 ring-[#4CAF50]/20"
      >

        <div
          ref={indicatorRef}
          className="absolute left-0 top-[6px] rounded-full bg-white shadow-md transition-transform duration-300 ease-out will-change-transform"
          aria-hidden
        />

        <button
          ref={btnIngRef}
          onClick={() => scrollTo("ingredients")}
          className={`relative z-[1] flex-1 rounded-full py-2 text-center text-[15px] font-semibold transition-colors ${
            active === "ingredients" ? "text-gray-800" : "text-gray-500 hover:text-[#4CAF50]"
          }`}
        >
          재료
        </button>
        <button
          ref={btnStepRef}
          onClick={() => scrollTo("steps")}
          className={`relative z-[1] flex-1 rounded-full py-2 text-center text-[15px] font-semibold transition-colors ${
            active === "steps" ? "text-gray-800" : "text-gray-500 hover:text-[#4CAF50]"
          }`}
        >
          조리 방법
        </button>
      </div>

      <section ref={ingredientsRef} data-observe-id="ingredients" className="mt-6">
        <h3 className="mb-3 font-semibold">필요한 재료</h3>
        <div className="rounded-2xl bg-[#4CAF50]/10 p-5 ring-1 ring-[#4CAF50]/20">
          <ul className="divide-y divide-[#4CAF50]/15">
            {data.ingredients.map((i, idx) => (
              <li key={idx} className="flex items-center justify-between py-3">
                <span className="font-medium text-[#2e7d32]">
                  {i.ingredientName}
                </span>
                <span className="text-[#2e7d32]">{i.quantity || "적당량"}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={stepsRef} data-observe-id="steps" className="mt-8">
        <h3 className="mb-3 font-semibold">조리 순서</h3>
        <ol className="space-y-3">
          {data.steps.map((s) => (
            <li key={s.stepNumber} className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4CAF50]/15 font-semibold text-[#2e7d32]">
                {s.stepNumber}
              </span>
              <div className="flex-1 rounded-xl bg-[#4CAF50]/10 px-4 py-3">{s.description}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* 별점 섹션 */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">별점</h3>
          {user && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="text-sm text-[#4CAF50] hover:underline"
            >
              {myRating > 0 ? "내 별점 수정하기" : "별점 주기"}
            </button>
          )}
        </div>
        <div className="rounded-2xl bg-[#4CAF50]/10 p-5 ring-1 ring-[#4CAF50]/20">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-[#2e7d32]">
              {data.averageRating.toFixed(1)}
            </div>
            <div>
              <RecipeRating value={data.averageRating} />
              {myRating > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  내 별점: <span className="font-semibold">{myRating}점</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 별점 입력 모달 */}
      {showRatingModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowRatingModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">별점 주기</h3>
            <p className="text-gray-600 mb-4">이 레시피에 별점을 남겨주세요</p>
            <div className="flex gap-2 justify-center mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRating(rating)}
                  className="text-4xl hover:scale-110 transition"
                >
                  {rating <= myRating ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRatingModal(false)}
              className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 댓글 섹션 */}
      <section className="mt-10">
        <h3 className="font-semibold mb-4">댓글 ({comments.length})</h3>

        {/* 댓글 작성 */}
        {user && (
          <div className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 작성해주세요"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="px-4 py-2 rounded-lg bg-[#4CAF50] text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                댓글 작성
              </button>
            </div>
          </div>
        )}

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.commentId}
                className="rounded-xl bg-gray-50 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{comment.userName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  {user && comment.userName === user.name && (
                    <button
                      onClick={() => handleDeleteComment(comment.commentId)}
                      className="text-sm text-red-600 hover:underline ml-4"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
